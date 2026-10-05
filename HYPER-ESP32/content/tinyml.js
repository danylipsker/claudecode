/* HYPER-ESP32 · content/tinyml.js
 *
 * Topic: Machine learning on the chip (tinyml). Ten pages:
 *   what-fits-in-a-microcontroller   the three budgets: flash for the weights, RAM for the arena, time for the MACs
 *   the-tinyml-pipeline              data, features, training on a computer, evaluation, shrinking, embedding, measuring
 *   quantization                     float32 to int8: scale, zero point, calibration, the outlier trap
 *   tflite-micro-and-esp-dl          the interpreter, the op resolver, the arena; Espressif's own library
 *   edge-impulse                     a hosted pipeline that exports a library; the confusion matrix
 *   keyword-spotting                 wave, spectrogram, small network, score; gates and thresholds
 *   gesture-recognition              windows of accelerometer samples, features, classes
 *   anomaly-detection                learning "normal" and flagging the distance from it
 *   calling-cloud-ai                 when the model is too big: an HTTPS request, with a token kept out of the source
 *   ai-accelerators-s3-and-p4        what the vector instructions of the S3 and the P4 add
 * Simulations: sims/tinyml.js (ids start with ml-).
 */
Hyper.add(
/* ================================================================ what-fits-in-a-microcontroller */
{
  id: 'what-fits-in-a-microcontroller',
  parent: 'tinyml',
  title: 'What fits in a microcontroller',
  level: 1,
  short: 'A neural network is a recipe and a pile of numbers. The chip stores the numbers in flash, keeps the working space in RAM and spends time on the arithmetic — three budgets, and a model has to fit all of them at once.',
  keywords: ['TinyML', 'machine learning', 'neural network', 'inference', 'weights', 'parameters', 'model size', 'tensor arena', 'MAC', 'multiply-accumulate', 'RAM', 'flash', 'PSRAM', 'edge AI', 'on-device', 'free heap'],
  prereq: ['cpu-cores-and-clocks', 'stack-heap-and-static', 'using-psram'],
  related: ['quantization', 'tflite-micro-and-esp-dl', 'ai-accelerators-s3-and-p4', 'calling-cloud-ai', 'partition-tables', 'heap-and-fragmentation', 'choosing-a-chip'],
  body: `A neural network is a recipe and a pile of numbers. The recipe says "multiply the input by these numbers, add the products up, bend the result, hand it to the next layer". The numbers — the **weights** — were found during training and never change afterwards. Running the recipe on one input is called **inference**, and it is the only part a microcontroller does. Finding the weights took a computer, thousands of examples and minutes to days of arithmetic; nobody trains on the chip ([[the-tinyml-pipeline]]). Machine learning that is small enough to run on a device like this is called **TinyML**.

### Three budgets, all at once

| Budget | What it pays for | Where it lives |
|---|---|---|
| Flash | the weights, one number each | read in place from flash through the cache ([[flash-and-the-cache]]) |
| RAM | the **tensor arena**: scratch space for the numbers passed from layer to layer | internal SRAM, or slower PSRAM ([[using-psram]]) |
| Time | one multiply-accumulate (MAC) each time a weight is used | the CPU |

The **weights** cost parameters times bytes each. A small network that reads 64 numbers, has a hidden layer of 32 and picks one of 4 classes has $64 \\cdot 32 + 32 + 32 \\cdot 4 + 4 = 2212$ parameters: 8.8 KB as 32-bit floats, 2.2 KB as 8-bit integers ([[quantization]]). A keyword spotter is tens of kilobytes, a small image classifier a few hundred, and a model that holds a conversation has billions of parameters — gigabytes, which is why it lives on a server ([[calling-cloud-ai]]).

The **arena** is not the sum of every layer's output. Once layer 3 has read the output of layer 2, that buffer can be reused, so the arena is about the largest pair of neighbouring buffers. The simulation below draws it for a few models.

The **time** is the number of MACs divided by how many the chip performs per second. A dense layer needs inputs times outputs of them; a convolution needs the output size times the filter size times the channels.

### What the chips have

Internal SRAM, from the board catalogue: ESP8266 160 KB, ESP32-C2 272 KB, ESP32-H2 320 KB, ESP32-C3 400 KB, ESP32-C5 384 KB, ESP32 520 KB, ESP32-C6 and ESP32-S3 512 KB, ESP32-P4 768 KB. PSRAM adds megabytes: the ESP32-S3 supports up to 32 MB mapped at a time, the ESP32-P4 carries 16 or 32 MB in its package; the C3, C6, H2 and C2 have no PSRAM interface at all.

Wi-Fi, Bluetooth, the operating system and your own buffers take their share of that RAM first, so the free figure is smaller — measure it with the program below instead of assuming. On the original ESP32 a very large static array may not even link, because static data has a limit well below the total RAM; allocate big arenas at run time.

### Where it breaks first

- **RAM**, usually: image models need an arena of hundreds of kilobytes, and PSRAM is slower than internal RAM.
- **Flash**: the default application partition on a 4 MB board is about 1.2 MB, so a model of a few megabytes needs its own partition ([[partition-tables]]).
- **Time**: a model that takes two seconds per answer cannot follow a gesture that lasts one.

> [!key] A model must fit three budgets at once: weights in flash, an arena in RAM and enough MACs per second. Count parameters and MACs before choosing a chip, then measure free memory and the real inference time on the board.`,
  ideas: [
    'A model is a structure plus weights; the chip only runs it (inference). Training happens on a computer.',
    'Flash holds the weights, RAM holds the tensor arena, the CPU pays for the multiply-accumulates: three separate budgets.',
    'The arena is about the largest pair of neighbouring layer buffers, not the sum of all of them.',
    'Free RAM after Wi-Fi, Bluetooth and the rest of the program is what counts, not the figure on the datasheet.'
  ],
  pitfalls: [
    'A 100 KB model needs 100 KB of RAM — The weights can stay in flash; what RAM must hold is the arena, which depends on the layer sizes, not on the weight count. A small model with big activations can need more RAM than a large one with small activations.',
    'The chip has 520 KB, so I have 520 KB — Wi-Fi, Bluetooth, FreeRTOS and your own buffers use a large part first, and memory is split into regions: the biggest free block may be far smaller than the free total.',
    'If it fits, it is fast enough — Fitting says nothing about speed. A model can fit and still need seconds per inference; check the time on the board with your model.'
  ],
  terms: [
    { term: 'TinyML', also: ['edge ML', 'embedded machine learning'], def: 'Machine learning small enough to run on a microcontroller, usually inference only: the model is trained on a computer and a few kilobytes to a few megabytes of it are copied into flash.' },
    { term: 'Inference', also: ['forward pass', 'prediction'], def: 'Running a trained model on one input to get an output, such as a class and its score. It is fixed arithmetic with no learning, and it is all the chip does.' },
    { term: 'Weights', also: ['parameters', 'model parameters'], def: 'The numbers a network learned during training: one per connection plus a bias per neuron. Their count and their size in bytes decide how much flash the model needs.' },
    { term: 'Tensor arena', also: ['arena', 'working memory'], def: 'A block of RAM the inference engine uses for the numbers passed between layers. Its size depends on the layer sizes and is set before the model runs.' },
    { term: 'MAC', also: ['multiply-accumulate', 'MACs'], def: 'One multiplication followed by an addition to a running sum: the basic step of a network. The number of MACs per inference, divided by the MAC rate of the chip, gives the time.' }
  ],
  choose: {
    good: ['Small signals: sound, motion, vibration, a handful of sensor channels', 'Decisions that must be fast, private or work with no network', 'Always-on sensing where sending the raw data would drain the battery'],
    avoid: ['Open-ended language, or large images at high resolution', 'Tasks with no labelled data and no way to collect it', 'Jobs a plain threshold or formula already does — simple beats clever'],
    check: ['Free RAM and the largest free block, after Wi-Fi and the rest of the program', 'Accuracy measured on data the model never saw', 'Time per inference on the real board with the real model']
  },
  code: [
    {
      title: 'How much memory is really free?',
      about: 'Prints the chip, the flash, the heap and the PSRAM, then asks for an arena of 100 KB in internal RAM and, if there is any, in PSRAM. Run it before choosing a model.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud. Turn PSRAM on in the board menu if the board has it.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [flash KB: ] (flash size in KB))
          print (join [heap free KB: ] (free heap in KB))
          print (join [largest free block KB: ] (largest free block in KB))
          if <PSRAM present?> then
            print (join [PSRAM free KB: ] (free PSRAM in KB))
          else
            print [no PSRAM]
          end
          print (join [100 KB arena in internal RAM fits: ] <can allocate (100) KB in internal RAM?>)
      `,
      cpp: String.raw`
        #include <esp_heap_caps.h>

        void tryArena(const char *where, uint32_t caps, size_t bytes) {
          void *p = heap_caps_malloc(bytes, caps);
          Serial.printf("a %u KB arena in %s: %s\n", (unsigned)(bytes / 1024), where, p ? "fits" : "does not fit");
          free(p);                                       // free(NULL) is harmless
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Serial.printf("chip   %s, %d MHz, %d core(s)\n", ESP.getChipModel(), ESP.getCpuFreqMHz(), ESP.getChipCores());
          Serial.printf("flash  %u KB chip, %u KB sketch, %u KB free\n", ESP.getFlashChipSize() / 1024, ESP.getSketchSize() / 1024, ESP.getFreeSketchSpace() / 1024);
          Serial.printf("heap   %u KB total, %u KB free, largest block %u KB\n", ESP.getHeapSize() / 1024, ESP.getFreeHeap() / 1024, ESP.getMaxAllocHeap() / 1024);
          if (psramFound()) Serial.printf("PSRAM  %u KB total, %u KB free\n", ESP.getPsramSize() / 1024, ESP.getFreePsram() / 1024);
          else Serial.println("PSRAM  none (or not enabled in the board menu)");
          tryArena("internal RAM", MALLOC_CAP_8BIT | MALLOC_CAP_INTERNAL, 100 * 1024);
          if (psramFound()) tryArena("PSRAM", MALLOC_CAP_SPIRAM, 100 * 1024);
        }

        void loop() {}
      `,
      py: String.raw`
        import gc, os, machine, esp32

        print("cpu    %d MHz" % (machine.freq() // 1000000))
        gc.collect()
        print("heap   %d KB in use, %d KB free" % (gc.mem_alloc() // 1024, gc.mem_free() // 1024))
        for total, free, largest, low in esp32.idf_heap_info(esp32.HEAP_DATA):
            print("region %d KB, %d KB free, largest block %d KB" % (total // 1024, free // 1024, largest // 1024))
        st = os.statvfs("/")
        print("flash  %d KB free in the file system" % (st[0] * st[3] // 1024))
        try:
            arena = bytearray(100 * 1024)
            print("a 100 KB arena: fits")
        except MemoryError:
            print("a 100 KB arena: does not fit")
      `,
      output: `
        chip   ESP32-S3, 240 MHz, 2 core(s)
        flash  8192 KB chip, 336 KB sketch, 1280 KB free
        heap   336 KB total, 296 KB free, largest block 270 KB
        PSRAM  8189 KB total, 8189 KB free
        a 100 KB arena in internal RAM: fits
        a 100 KB arena in PSRAM: fits
      `,
      notes: ['The figures above are only an example: yours depend on the board, the partition scheme and what the sketch has started. Run it with Wi-Fi connected as well, because the radio takes RAM.', 'MicroPython keeps one garbage-collected heap; on a board with PSRAM the interpreter uses it, so gc.mem_free() can show megabytes. esp32.idf_heap_info() lists the separate regions of the underlying heap.', 'A model weighs on flash and the arena on RAM: compare the sketch size and the free sketch space with the model file, and the largest free block with the arena the model asks for.']
    }
  ],
  examples: [
    {
      title: 'Will the gesture model fit on an ESP32-C3?',
      q: 'A gesture classifier reads 150 numbers (50 samples of 3 axes), has two dense layers of 48 and 24 neurons and 5 outputs, stored as int8. Its largest pair of neighbouring buffers is 200 bytes. The ESP32-C3 has 400 KB of SRAM. Is memory a problem?',
      steps: ['Parameters: $150 \\cdot 48 + 48 = 7248$; $48 \\cdot 24 + 24 = 1176$; $24 \\cdot 5 + 5 = 125$. Total $8549$.', 'As int8 that is about 8.3 KB of flash; as float32 it would be 33 KB. Either is tiny.', 'MACs: $150 \\cdot 48 + 48 \\cdot 24 + 24 \\cdot 5 = 8472$. At even 1 MAC per 20 cycles on a 160 MHz core that is $8472 \\cdot 20 / 160\\,\\mathrm{MHz} \\approx 1$ ms.', 'The arena is a few hundred bytes. Memory and time are both far from any limit.'],
      a: 'Memory is not the problem: about 8 KB of weights, a few hundred bytes of arena and roughly a millisecond per inference. The hard parts of a gesture project are the data and the features, not the chip.'
    }
  ],
  formulas: [
    {
      name: 'Parameters of a dense layer',
      expr: 'P = nin*nout + nout',
      tex: 'P = n_{\\mathrm{in}}\\, n_{\\mathrm{out}} + n_{\\mathrm{out}}',
      vars: {
        P: { name: 'parameters (weights and biases)', q: 'count' },
        nin: { name: 'inputs of the layer', q: 'count', value: 64, min: 1, int: true, tex: 'n_{\\mathrm{in}}' },
        nout: { name: 'neurons (outputs) of the layer', q: 'count', value: 32, min: 1, int: true, tex: 'n_{\\mathrm{out}}' }
      },
      solveFor: 'P',
      note: 'One weight per connection plus one bias per neuron. Convolutions share their weights over the image, so they have far fewer parameters than their MAC count suggests.',
      stories: { P: 'A dense layer takes {nin} inputs and has {nout} neurons. How many parameters does it hold?' }
    },
    {
      name: 'Size of the weights',
      expr: 'S = P*b/8/1024',
      tex: 'S = \\frac{P\\, b}{8 \\cdot 1024}',
      vars: {
        S: { name: 'size of the weights', unit: 'KB' },
        P: { name: 'parameters', q: 'count', value: 250000, min: 1, int: true },
        b: { name: 'bits per weight (32 float, 8 int8)', q: 'count', value: 8, min: 1, max: 32, int: true }
      },
      solveFor: 'S',
      note: 'The file also holds the structure and some tables, so the real file is a little larger. 1 KB here is 1024 bytes.',
      stories: { S: 'A model has {P} parameters stored with {b} bits each. How much flash do the weights need, in KB?' }
    },
    {
      name: 'Time of one inference',
      expr: 't = M/(f*r)',
      tex: 't = \\frac{M}{f\\, r}',
      vars: {
        t: { name: 'time for one inference', q: 'time', unit: 'ms' },
        M: { name: 'multiply-accumulates in the model', q: 'count', value: 2000000, min: 1 },
        f: { name: 'clock frequency', q: 'frequency', unit: 'MHz', value: 240, min: 1 },
        r: { name: 'MACs completed per clock cycle (measure it)', q: 'none', value: 0.25, min: 0.001 }
      },
      solveFor: 't',
      note: 'The rate r depends on the chip, the library and the layer type: plain C code on a core without vector instructions often completes well under one MAC per cycle. Measure it with the timing program on the S3 and P4 page.',
      stories: { t: 'A model needs {M} MACs. The chip runs at {f} and completes {r} MAC per cycle. How long does one inference take?' }
    }
  ],
  quiz: [
    { q: 'A model has 500,000 parameters stored as 8-bit integers. Roughly how much flash do the weights need?', choices: ['50 KB', '500 KB', '2 MB', '4 MB'], a: 1, why: 'One byte per weight: 500,000 bytes, about 490 KB. As 32-bit floats it would be four times that, 2 MB.' },
    { q: 'Which budget does the tensor arena draw on?', choices: ['Flash', 'RAM', 'The CPU clock', 'The battery only'], a: 1, why: 'The arena holds the numbers passed between layers while the model runs, so it lives in RAM (internal SRAM or PSRAM). The weights live in flash, and the clock pays for the MACs.' },
    { q: 'A network has three layers whose outputs are 30 KB, 20 KB and 10 KB, and its input is 40 KB. About how large is the arena, if buffers are reused as soon as the next layer has read them?', choices: ['100 KB — the sum', '70 KB — the two largest neighbours (input and first output)', '30 KB — the largest output', '10 KB — the last output'], a: 1, why: 'At the moment the first layer runs, its 40 KB input and its 30 KB output must both exist: 70 KB. Later pairs are smaller (50 KB, 30 KB), so 70 KB is the peak.' },
    { q: 'A model fits in flash and in RAM, so it will run fast enough for a real-time application.', a: false, why: 'Fitting is only two of the three budgets. The time per inference depends on the MAC count, the clock and how many MACs per cycle the code achieves, and it must be measured on the board.' }
  ],
  applications: [
    'Keyword spotting and wake words that listen all day on a few milliwatts.',
    'Gesture and activity recognition from an accelerometer in a wearable.',
    'Vibration and sound anomaly detection on a motor or a pump.',
    'Small image classifiers on a camera board: person present or not, object in view or not.'
  ],
  sources: [
    'Warden and Situnayake, *TinyML* (O\'Reilly): the budgets of flash, RAM and time for models on microcontrollers.',
    'The TensorFlow Lite for Microcontrollers documentation (now LiteRT for Microcontrollers): memory planning and the tensor arena.',
    'Espressif, *ESP-IDF Programming Guide*, "Heap Memory Allocation": the heap, capabilities and external RAM.'
  ],
  sim: { id: 'ml-fit', params: { mode: 'memory' } }
},

/* ================================================================ the-tinyml-pipeline */
{
  id: 'the-tinyml-pipeline',
  parent: 'tinyml',
  title: 'From data to a model on the chip',
  level: 1,
  short: 'Collect labelled data on the real device, turn it into features, train on a computer, test on data the model never saw, shrink the model and embed it. Most of the work is the data, not the network.',
  keywords: ['TinyML workflow', 'dataset', 'labels', 'training', 'validation', 'test set', 'overfitting', 'features', 'data collection', 'train test split', 'leakage', 'class imbalance', 'xxd', 'model.h', 'CSV', 'serial capture', 'deployment'],
  prereq: ['what-fits-in-a-microcontroller', 'analog-input', 'sample-time-and-jitter'],
  related: ['quantization', 'tflite-micro-and-esp-dl', 'edge-impulse', 'gesture-recognition', 'filtering-sensor-data', 'logging-data'],
  body: `People imagine machine learning as choosing a clever network. In practice the network is the easy part: a few lines of Python. The hard part is the **data**, and the chip appears twice in the story — as the instrument that gathers the data, and as the place the finished model finally runs.

### The ten steps

1. **Ask a narrow question.** "Is the washing machine in its spin cycle?", not "what is the machine doing?". Write down the classes, including a class for "none of the above".
2. **Collect data on the device you will deploy.** The real sensor, mounted as it will be mounted, in the real noise. The program below prints labelled samples over the serial port.
3. **Split before you look.** Training, validation and test sets. Split by *session* or *person*, never by random sample: neighbouring windows of one recording are near-copies, and a test set that contains them measures memory, not understanding.
4. **Extract features.** A window of raw samples, or its spectrum, or a few summary numbers. The same code must run on the chip later, bit for bit.
5. **Train on a computer**, in Python with a framework. A small model trains in minutes.
6. **Test** on the held-out set. Look at a [confusion matrix](#/c/edge-impulse), not only the accuracy.
7. **Shrink**: quantise to 8 bits, trim the architecture ([[quantization]]).
8. **Convert and embed**: the model becomes a file of a few kilobytes, copied into the program as an array or placed in a partition ([[tflite-micro-and-esp-dl]]).
9. **Measure on the chip**: time, memory and, again, accuracy. A number that was right on the computer can differ after quantisation or after a change in feature code.
10. **Deploy, watch, collect the failures, retrain.**

### How much data

Enough to cover the variation, not just the average. A gesture needs a few hundred windows per class from several people and several ways of holding the device. A keyword needs thousands of recordings by many voices. An anomaly detector needs hours of normal running through a whole day and season. Doubling the variety helps more than doubling the network.

### Traps

- **Leakage**: the test set secretly overlaps the training set, so the score is flattering.
- **Imbalance**: a detector for something that happens 1 % of the time scores 99 % by always saying "no".
- **Skew**: the features computed in Python differ slightly from the C code on the chip — a different window, filter or scaling — and the model sees data it was never trained on.

The simulation shows the one step that happens off the chip: a tiny network learning to separate two kinds of points. Training adjusts the weights; afterwards only the forward pass remains.

> [!key] The pipeline runs from data collection on the device, through training on a computer, to a small quantised model embedded in the program. The data, how it is split and how the features are computed decide success far more than the choice of network.`,
  ideas: [
    'The chip gathers the data and later runs the model; the training in between happens on a computer.',
    'Split train, validation and test by session or person, so that near-copies never sit on both sides.',
    'The feature code must be identical in training and on the chip, or the model sees data it never learned.',
    'Measure the finished model on the chip, not only on the computer: quantisation and feature code can change the result.'
  ],
  pitfalls: [
    'A random 80/20 split of all samples is a fair test — Windows from one recording are near-duplicates, so a random split puts almost the same data on both sides and flatters the model. Split by recording session, person or day.',
    '99 % accuracy means the model works — For a rare event, always answering "normal" already scores 99 %. Look at how many real events are found (recall) and how many alarms are false (precision).',
    'More layers always help — Beyond a point a bigger network memorises the training set (overfitting) and does worse on new data, while costing more flash, RAM and time. More varied data usually helps more.'
  ],
  terms: [
    { term: 'Training set', also: ['validation set', 'test set', 'train/test split'], def: 'The data is divided: the training set adjusts the weights, the validation set guides choices such as when to stop, and the test set, used once at the end, estimates how the model behaves on new data.' },
    { term: 'Label', also: ['class', 'ground truth'], def: 'The correct answer attached to one example, such as "wave" or "idle". Labelled data is what supervised training learns from.' },
    { term: 'Feature extraction', also: ['features', 'preprocessing', 'DSP block'], def: 'Turning raw samples into the numbers the network reads: a window of samples, their spectrum, their average or their peaks. It runs on the chip before every inference.' },
    { term: 'Overfitting', also: ['memorising'], def: 'A model that fits the training data so closely that it learns its noise, and then does worse on new data. The signature is a high training score and a low test score.' },
    { term: 'Data leakage', also: ['leak', 'train-test contamination'], def: 'Information from the test data sneaking into training, for instance near-duplicate windows on both sides of the split. It makes the measured accuracy better than the real one.' }
  ],
  choose: {
    good: ['A narrow question with clear classes and a "none of these" class', 'Data you can collect on the real device, as it will be mounted', 'A way to measure accuracy on a recording the model never saw'],
    avoid: ['Training on data from a lab bench for a device that lives in a noisy factory', 'Judging a rare-event detector by accuracy alone', 'Changing the feature code after training without retraining'],
    check: ['That the split is by session or person, not by random sample', 'That the chip computes the same features as the training script', 'The accuracy of the quantised model running on the chip']
  },
  code: [
    {
      title: 'Record labelled samples while a button is held',
      about: 'Samples an analogue sensor 100 times a second and prints a CSV line (label, time, value) only while the button is pressed. Capture the serial output to a file on the computer — that file is your first dataset. Change LABEL for each recording session.',
      needs: 'An ESP32 DevKit, an analogue sensor on GPIO34 (a microphone module with an analogue output, a potentiometer, a light sensor in a divider) and a push button.',
      wiring: [['GPIO34', 'sensor output', 'an ADC1 pin: fine with Wi-Fi on'], ['GPIO4', 'button → GND', 'internal pull-up'], ['3V3 / GND', 'sensor supply']],
      blocks: `
        when started
          set pin (4) as [input with pull-up v]
          start serial at (115200) baud
          print [label,t_ms,value]

        every (0.01) seconds
          if <(read pin (4)) = [LOW v]> then
            print (join [idle,] (milliseconds since start) [,] (analog read pin (34)))
          end
      `,
      cpp: String.raw`
        const int SENSOR_PIN = 34;          // ADC1
        const int BUTTON_PIN = 4;           // button to GND, internal pull-up
        const char *LABEL = "idle";         // change for each recording session: "idle", "wave", "shake" ...
        const uint32_t PERIOD_US = 10000;   // 100 samples a second

        uint32_t nextAt = 0;

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON_PIN, INPUT_PULLUP);
          Serial.println("label,t_ms,value");
          nextAt = micros();
        }

        void loop() {
          if ((int32_t)(micros() - nextAt) < 0) return;    // not yet: keeps the sample rate steady
          nextAt += PERIOD_US;
          if (digitalRead(BUTTON_PIN) == LOW) {            // record only while the button is held
            Serial.printf("%s,%lu,%d\n", LABEL, millis(), analogRead(SENSOR_PIN));
          }
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        SENSOR = ADC(Pin(34), atten=ADC.ATTN_11DB)   # ADC1
        BUTTON = Pin(4, Pin.IN, Pin.PULL_UP)         # button to GND, internal pull-up
        LABEL = "idle"                               # change for each recording session
        PERIOD_US = 10000                            # 100 samples a second

        print("label,t_ms,value")
        next_t = time.ticks_us()
        while True:
            if time.ticks_diff(time.ticks_us(), next_t) < 0:
                continue                             # not yet: keeps the sample rate steady
            next_t = time.ticks_add(next_t, PERIOD_US)
            if BUTTON.value() == 0:                  # record only while the button is held
                print("%s,%d,%d" % (LABEL, time.ticks_ms(), SENSOR.read_u16() >> 4))
      `,
      output: `
        label,t_ms,value
        idle,10234,1987
        idle,10244,1990
        idle,10254,1984
      `,
      notes: ['The schedule adds a fixed period to the previous deadline instead of reading the clock again, so printing time does not stretch the sample interval ([[sample-time-and-jitter]]). A line of this size takes under 2 ms at 115200 baud, well within the 10 ms period.', 'Record each class in several sessions, on different days and with different people, and keep whole sessions together when you split the data.', 'The MicroPython value is the 16-bit reading shifted to 12 bits, so both versions print 0 to 4095. The ESP32 ADC is not linear near the ends of its range ([[the-esp-adc]]).']
    }
  ],
  quiz: [
    { q: 'You record 20 minutes of one person waving, cut it into 2-second windows and split the windows at random: 80 % training, 20 % test. What is wrong?', choices: ['Nothing: 80/20 is the standard split', 'Neighbouring windows are near-copies, so the test set overlaps the training set', 'The windows are too long', 'You need to use more than one class'], a: 1, why: 'Neighbouring windows of one recording are almost the same data. A random split puts such near-duplicates on both sides, so the test score measures memory. Split by recording or by person.' },
    { q: 'A fault happens in 1 of every 200 windows. A detector that always says "no fault" has what accuracy?', choices: ['0.5 %', '50 %', '99.5 %', '100 %'], a: 2, why: 'It is right on 199 of 200 windows. Yet it never finds a fault: for rare events accuracy hides everything, and recall and precision tell the truth.' },
    { q: 'The model scores 97 % on the training data and 71 % on the test data. What is the most likely cause?', choices: ['Overfitting', 'The chip is too slow', 'The quantisation scale is too small', 'The batteries are low'], a: 0, why: 'A large gap between training and test scores is the signature of overfitting: the model learned the training examples, noise included, instead of the pattern.' },
    { q: 'The model works on the computer, but on the chip its answers are poor. Name a likely cause that has nothing to do with the network.', choices: ['The features are computed differently in C than in the training script', 'The chip has no Wi-Fi', 'The model is written in the wrong language', 'The serial speed is too low'], a: 0, why: 'A different window length, filter, scaling or sample rate in the feature code means the model sees inputs it was never trained on. The feature code is part of the model.' }
  ],
  applications: [
    'Collecting accelerometer recordings of gestures, exercises or machine states for a classifier.',
    'Gathering hours of normal vibration from a pump before training an anomaly detector.',
    'Recording the same spoken word from many people for a keyword spotter.',
    'Building a small image set of the real scene a camera board will watch.'
  ],
  sources: [
    'Warden and Situnayake, *TinyML* (O\'Reilly): the workflow from data collection to deployment.',
    'The TensorFlow Lite for Microcontrollers documentation (now LiteRT for Microcontrollers): converting a model and running it on a device.',
    'Espressif, *ESP-IDF Programming Guide*: the ADC oneshot driver and calibration used by the capture program.'
  ],
  sim: 'ml-net'
},

/* ================================================================ quantization */
{
  id: 'quantization',
  parent: 'tinyml',
  title: 'Quantization',
  level: 2,
  short: 'Storing every weight in one byte instead of four makes a model about four times smaller and lets chips without a floating-point unit run it. The price is rounding, and it is paid mostly by the awkward values.',
  keywords: ['quantization', 'quantisation', 'int8', 'float32', 'scale', 'zero point', 'calibration', 'representative dataset', 'post-training quantization', 'quantization-aware training', 'per-channel', 'rounding error', 'outlier', 'clipping', 'int16', 'integer arithmetic'],
  prereq: ['what-fits-in-a-microcontroller', 'bits-and-bytes', 'the-tinyml-pipeline'],
  related: ['tflite-micro-and-esp-dl', 'ai-accelerators-s3-and-p4', 'edge-impulse', 'accuracy-resolution-precision'],
  body: `A trained network stores its weights as 32-bit floating-point numbers, four bytes each. That is a luxury: the weights hardly need seven decimal digits. **Quantisation** replaces each weight by a small integer and one shared number that says how big a step of that integer is. With 8 bits the model shrinks about fourfold, and the arithmetic becomes integer arithmetic — which suits chips that have no floating-point unit (among the catalogue chips, the ESP32-C3, C6 and H2 have none; the ESP32, S3 and P4 have one).

### The mapping

For each tensor, real values and integers are related by

$$ x_{\\text{real}} = s \\cdot (q - z) $$

where $q$ is the stored integer (−128 to 127 for int8), $s$ the **scale** (the size of one step) and $z$ the **zero point** (the integer that stands for 0.0). Weights are usually *symmetric*: $z = 0$ and $s = \\max|w| / 127$. Activations are usually *asymmetric*, with a zero point that makes the full range of integers cover the range the numbers really take. Convolution weights often get one scale per output channel, which keeps a channel with small weights from being rounded to nothing.

Rounding to the nearest step makes an error of at most half a step, $s/2$. Each extra bit halves the step, which is worth about 6 dB of signal-to-noise ratio — the same rule as for an ADC ([[accuracy-resolution-precision]]).

### Learning the ranges

Weights are known, but the **activations** change with every input, so their ranges must be estimated. In *post-training quantisation* a few hundred typical inputs (the representative dataset) are pushed through the float model while the tool records the range of every tensor. In *quantisation-aware training* the rounding is simulated during training so that the network learns to live with it; it costs more effort and rescues models that post-training quantisation damages.

### The outlier trap

The scale is set by the range. One weight ten times larger than the rest forces a ten-times-larger step on all of them, and most weights land on a handful of integers. Tools clip such outliers or use per-channel scales; the simulation lets you provoke the problem.

### What it costs

Often a point or two of accuracy, sometimes none, occasionally much more — so measure the quantised model on the test set, and again on the chip. Intermediate sums are held in 32 bits and scaled back at the end of each layer. Some models use 16-bit activations with 8-bit weights where 8 bits hurt, and Espressif's own library offers 8-bit and 16-bit models ([[tflite-micro-and-esp-dl]]).

> [!key] Quantisation stores each tensor as small integers plus a scale (and zero point): about a quarter of the size and integer arithmetic, with a rounding error of at most half a step. Outliers waste the range, so check the accuracy of the quantised model rather than trusting it.`,
  ideas: [
    'A quantised tensor is integers plus a scale (and a zero point): real = scale × (integer − zero point).',
    'int8 makes a model about four times smaller and turns the arithmetic into integer arithmetic, which suits chips without an FPU.',
    'The rounding error is at most half a step, and every extra bit halves the step.',
    'Activation ranges are learned from a representative dataset; outliers waste the range and hurt accuracy.'
  ],
  pitfalls: [
    'Quantising to int8 loses a quarter of the accuracy — Usually it loses a point or two, sometimes nothing. The loss depends on the network and on outliers; measure the quantised model on held-out data instead of guessing.',
    'The calibration data does not matter — The activation ranges come from it. If it contains only quiet inputs, loud ones will be clipped on the chip. Use inputs that cover what the device will really see.',
    'Quantisation makes the model faster on every chip — It shrinks the model on every chip, but the speed gain depends on the code: integer kernels with vector instructions (S3, P4) gain a lot, plain scalar code gains less, and a chip without an FPU gains because float arithmetic would have been emulated.'
  ],
  terms: [
    { term: 'Quantisation', also: ['quantization', 'int8 model'], def: 'Replacing 32-bit floating-point numbers by small integers (usually 8 bits) with a shared scale. The model becomes about four times smaller and runs on integer arithmetic.' },
    { term: 'Scale', also: ['step size', 'quantisation step'], def: 'The real-valued size of one step of the integer: a tensor with scale 0.01 stores 0.00, 0.01, 0.02 … as 0, 1, 2 …' },
    { term: 'Zero point', also: ['offset'], def: 'The integer that stands for the real value 0.0. It is 0 for symmetric weights and non-zero for asymmetric activations.' },
    { term: 'Calibration', also: ['representative dataset'], def: 'Running typical inputs through the float model to record the range of every activation, so the converter can choose scales and zero points.' },
    { term: 'Quantisation-aware training', also: ['QAT'], def: 'Training with the rounding of int8 simulated, so the network adapts to it. It recovers accuracy that conversion after training would lose.' }
  ],
  choose: {
    good: ['Almost every model for a microcontroller: it is the normal final step', 'Chips without an FPU, where float arithmetic would be emulated', 'Models that must fit flash and RAM budgets'],
    avoid: ['Skipping calibration or using unrepresentative calibration data', 'Weights with a few huge outliers, left unclipped', 'Going below 8 bits without tool support and a proven accuracy test'],
    check: ['Accuracy of the quantised model on the test set', 'The same accuracy measured on the chip', 'That input scaling in the program matches the model\'s input scale and zero point']
  },
  code: [
    {
      title: 'Quantise eight weights by hand',
      about: 'Finds the largest weight, derives the scale, rounds each weight to an int8 and prints the value the chip would effectively use, with its error. This is exactly what a converter does to a tensor, on a very small one.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [weights v] to (list [0.42] [-0.13] [0.77] [-0.58] [0.05] [0.31] [-0.8] [0.19])
          set [scale v] to ((largest absolute value in (weights)) / (127))
          print (join [scale ] (scale))
          for each [w v] in (weights)
            set [q v] to (round ((w) / (scale)))
            print (join (w) [ -> ] (q) [ -> ] ((q) * (scale)))
          end
      `,
      cpp: String.raw`
        const float w[8] = { 0.42, -0.13, 0.77, -0.58, 0.05, 0.31, -0.80, 0.19 };

        void setup() {
          Serial.begin(115200);
          delay(500);
          float maxAbs = 0;
          for (int i = 0; i < 8; i++) if (fabsf(w[i]) > maxAbs) maxAbs = fabsf(w[i]);
          float scale = maxAbs / 127.0f;                  // one step of the int8 scale
          Serial.printf("scale %.5f, largest error possible %.5f\n", scale, scale / 2);
          for (int i = 0; i < 8; i++) {
            int8_t q = (int8_t)roundf(w[i] / scale);      // what is stored: 1 byte instead of 4
            float back = q * scale;                       // what the arithmetic effectively uses
            Serial.printf("%6.3f -> %4d -> %6.3f   error %.4f\n", w[i], q, back, back - w[i]);
          }
        }

        void loop() {}
      `,
      py: String.raw`
        w = [0.42, -0.13, 0.77, -0.58, 0.05, 0.31, -0.80, 0.19]

        max_abs = max(abs(x) for x in w)
        scale = max_abs / 127                            # one step of the int8 scale
        print("scale %.5f, largest error possible %.5f" % (scale, scale / 2))
        for x in w:
            q = round(x / scale)                         # what is stored: 1 byte instead of 4
            back = q * scale                             # what the arithmetic effectively uses
            print("%6.3f -> %4d -> %6.3f   error %.4f" % (x, q, back, back - x))
      `,
      output: `
        scale 0.00630, largest error possible 0.00315
         0.420 ->   67 ->  0.422   error 0.0020
        -0.130 ->  -21 -> -0.132   error -0.0023
         0.770 ->  122 ->  0.769   error -0.0015
        -0.580 ->  -92 -> -0.580   error 0.0005
         0.050 ->    8 ->  0.050   error 0.0004
         0.310 ->   49 ->  0.309   error -0.0013
        -0.800 -> -127 -> -0.800   error 0.0000
         0.190 ->   30 ->  0.189   error -0.0010
      `,
      notes: ['The largest weight maps to exactly 127 or -127, so nothing is clipped; every error is under half a step. Add a weight of 8.0 to the list and watch every other value collapse onto a few integers.', 'Real converters do this per tensor or per channel, and also fold a bias and a rescaling factor into each layer so the whole network runs on integers.', 'Set the scale from 0.0 to the largest weight only if the weights are roughly symmetric around zero; activations use a zero point.']
    }
  ],
  examples: [
    {
      title: 'The step and the worst error',
      q: 'A tensor of activations takes values from −0.62 to 0.80. It is stored with 8 bits. What is the step, and what is the largest rounding error?',
      steps: ['Range: $0.80 - (-0.62) = 1.42$. There are $2^8 - 1 = 255$ steps between the lowest and highest integer.', 'Step: $s = 1.42 / 255 = 0.00557$.', 'Largest error: half a step, $s / 2 = 0.00278$ — about 0.2 % of the range.', 'With 4 bits: $s = 1.42 / 15 = 0.0947$ and an error of 0.047, sixteen times worse.'],
      a: 'A step of about 0.0056 and a largest error of about 0.0028 (0.2 % of the range). Four bits would be sixteen times coarser.'
    }
  ],
  formulas: [
    {
      name: 'Scale of a quantised tensor',
      expr: 's = (xmax - xmin)/(2^b - 1)',
      tex: 's = \\frac{x_{\\max} - x_{\\min}}{2^{b} - 1}',
      vars: {
        s: { name: 'scale (size of one step)', q: 'none', tex: 's' },
        xmax: { name: 'largest value in the tensor', q: 'none', value: 0.8, signed: true, tex: 'x_{\\max}' },
        xmin: { name: 'smallest value in the tensor', q: 'none', value: -0.62, signed: true, tex: 'x_{\\min}' },
        b: { name: 'bits per value', q: 'count', value: 8, min: 1, max: 16, int: true }
      },
      solveFor: 's',
      note: 'This is the asymmetric form used for activations. For symmetric weights the range is taken as plus and minus the largest absolute value, divided into 254 steps.',
      stories: { s: 'A tensor ranges from {xmin} to {xmax} and is stored with {b} bits. What is its scale?' }
    },
    {
      name: 'Largest rounding error',
      expr: 'emax = s/2',
      tex: 'e_{\\max} = \\frac{s}{2}',
      vars: {
        emax: { name: 'largest rounding error', q: 'none', tex: 'e_{\\max}' },
        s: { name: 'scale (size of one step)', q: 'none', value: 0.00557, min: 0, tex: 's' }
      },
      solveFor: 'emax',
      note: 'Rounding to the nearest step is wrong by at most half a step. Values that are clipped (outside the range) can be wrong by much more.'
    },
    {
      name: 'Signal-to-noise ratio of the quantiser',
      expr: 'SNR = 6.02*b + 1.76',
      tex: '\\mathrm{SNR} \\approx 6.02\\, b + 1.76\\ \\mathrm{dB}',
      vars: {
        SNR: { name: 'signal-to-quantisation-noise ratio', q: 'gain', unit: 'dB', tex: '\\mathrm{SNR}' },
        b: { name: 'bits per value', q: 'count', value: 8, min: 1, max: 24, int: true }
      },
      solveFor: 'SNR',
      note: 'The classic result for a full-scale sine wave and a uniform quantiser; real weights and activations are not full-scale sines, so treat it as the six-decibels-per-bit rule rather than a prediction.',
      stories: { SNR: 'A tensor is stored with {b} bits. What is the signal-to-noise ratio of the rounding, in dB?' }
    }
  ],
  quiz: [
    { q: 'You store a tensor with 8 bits instead of 32. About how much smaller is it?', choices: ['Two times', 'Four times', 'Eight times', 'Thirty-two times'], a: 1, why: '32 bits to 8 bits is a factor of four. (Eight times would be 4 bits; the factor of 32 does not occur outside binary networks.)' },
    { q: 'Weights are almost all between −0.1 and 0.1, but one equals 5.0. What does a symmetric int8 scheme do to the others?', choices: ['Nothing: each value is independent', 'The step becomes about 0.04, so most weights round to a few integers near zero', 'It rounds the 5.0 to zero', 'It refuses to quantise'], a: 1, why: 'The scale is set by the largest absolute value: 5.0 / 127 is about 0.039. The ordinary weights, up to 0.1, span only about 2 or 3 steps and lose almost all their resolution. This is why tools clip outliers.' },
    { q: 'What do you need to quantise the activations of a network after training?', choices: ['Nothing; they are fixed numbers', 'A representative dataset, to learn the range of every tensor', 'A faster chip', 'The weights in 4 bits'], a: 1, why: 'Unlike the weights, activations depend on the input. The converter feeds typical inputs through the float model to see their ranges and then chooses scales and zero points.' },
    { q: 'Removing 2 bits from each value (8 to 6 bits) makes the quantisation step...', choices: ['two times smaller', 'two times larger', 'four times larger', 'unchanged'], a: 2, why: 'Each bit removed doubles the step: two bits make it four times coarser, and cost about 12 dB of signal-to-noise ratio.' }
  ],
  applications: [
    'Squeezing a keyword-spotting model into a few tens of kilobytes of flash.',
    'Running a classifier on an ESP32-C3 or C6, which have no floating-point unit, without slow emulated arithmetic.',
    'Making an image model small enough to fit the arena of an ESP32-S3 camera board.',
    'Producing the int8 files that Espressif\'s optimised kernels expect.'
  ],
  sources: [
    'The TensorFlow Lite 8-bit quantisation specification (LiteRT documentation): symmetric weights, asymmetric activations, per-channel scales.',
    'Jacob et al., "Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference" (2018): the scale and zero-point scheme.',
    'Espressif, ESP-DL documentation: quantised models and the quantisation tool for Espressif chips.'
  ],
  sim: 'ml-quant'
},

/* ================================================================ tflite-micro-and-esp-dl */
{
  id: 'tflite-micro-and-esp-dl',
  parent: 'tinyml',
  title: 'TensorFlow Lite Micro and ESP-DL',
  level: 3,
  short: 'Two ways to run a trained model on an ESP: the portable interpreter from the TensorFlow family, with Espressif\'s fast kernels underneath, and Espressif\'s own inference library for the chips with vector instructions.',
  keywords: ['TensorFlow Lite Micro', 'TFLM', 'LiteRT', 'LiteRT for Microcontrollers', 'esp-tflite-micro', 'ESP-NN', 'ESP-DL', 'ESP-PPQ', 'tflite', 'flatbuffer', 'op resolver', 'interpreter', 'tensor arena', 'AllocateTensors', 'Invoke', 'arena_used_bytes', 'model.h', 'xxd', 'espdl'],
  prereq: ['the-tinyml-pipeline', 'quantization', 'what-fits-in-a-microcontroller'],
  related: ['edge-impulse', 'ai-accelerators-s3-and-p4', 'keyword-spotting', 'image-classification', 'partition-tables', 'embedding-files-and-web-pages', 'esp-idf-basics'],
  body: `**TensorFlow Lite for Microcontrollers** (TFLM) is an interpreter written in C++ that runs a model on a device with no operating system, no file system and no dynamic memory. Google has since renamed the mobile family LiteRT, and the microcontroller version is now documented as LiteRT for Microcontrollers, but the code, the examples and most of the world still say TFLM. Espressif maintains a port, the \`esp-tflite-micro\` component, whose kernels come from **ESP-NN**: neural-network functions written for the ESP32 family, fastest on chips with vector instructions.

### The five steps of every TFLM program

1. **The model** is a file in the .tflite format (a FlatBuffer), turned into a C array with a tool such as \`xxd -i\`, or kept in a flash partition. It sits in flash and is read in place.
2. **The op resolver** is a list of the operations the model uses — fully connected, convolution, ReLU, softmax. Register only those, and the code stays small. "Didn't find op for builtin opcode" at start-up means one is missing.
3. **The interpreter** is created with the model, the resolver and the **arena**, a block of RAM you provide. \`AllocateTensors()\` plans every buffer inside it and fails if it is too small; afterwards the interpreter can report how much it really used, so start generous and trim.
4. **Fill the input tensor.** An int8 model expects integers: \`q = x / scale + zero_point\`, with the scale and zero point stored in the tensor ([[quantization]]).
5. **\`Invoke()\`**, then read the output tensor and convert back with its own scale and zero point.

There is no heap allocation after step 3, which is the point: the memory needed is known and constant, and nothing fragments ([[heap-and-fragmentation]]).

### ESP-DL

**ESP-DL** is Espressif's own deep-learning inference library. Models are trained in PyTorch or another framework, exported through ONNX and quantised with Espressif's own tool to a file in Espressif's format, and the library runs them with kernels written for the vector instructions of the ESP32-S3 and ESP32-P4 ([[ai-accelerators-s3-and-p4]]). Espressif's ready-made vision and speech models — face detection in ESP-WHO, wake words and commands in ESP-SR — are built on it. Check the project's supported-chip table for the chips beyond the S3 and P4.

### Which one

| | TFLM (esp-tflite-micro) | ESP-DL |
|---|---|---|
| Models from | TensorFlow, Keras, Edge Impulse, many converters | PyTorch and ONNX, via Espressif's tool |
| Chips | the whole family | tuned for the S3 and P4 |
| Strength | portable, huge example base | fast on the vector chips, Espressif's models |
| Build system | ESP-IDF component (Arduino libraries exist too) | ESP-IDF component |

MicroPython has no official TFLM module; the program below is therefore C++.

> [!key] TFLM runs a .tflite model through an op resolver and a fixed arena, with no allocation at run time; ESP-NN makes its kernels fast on the ESP32 family. ESP-DL is Espressif's own library, aimed at the S3 and P4 and at Espressif's vision and speech models.`,
  ideas: [
    'A TFLM program has five steps: model array, op resolver, interpreter with an arena, fill the input, Invoke and read the output.',
    'The arena is provided by you and planned once by AllocateTensors; nothing is allocated while the model runs.',
    'Register only the operations the model uses, to keep the code small; a missing one stops the start-up with a clear message.',
    'ESP-NN supplies fast kernels to TFLM on the ESP32 family; ESP-DL is a separate Espressif library aimed at the S3 and P4.'
  ],
  pitfalls: [
    'The input of an int8 model is the sensor value as it comes — The model expects integers on its own scale: divide by the input tensor\'s scale and add its zero point. Feeding raw numbers gives plausible-looking nonsense.',
    'The arena size from the example will do — It depends on your model. Too small and AllocateTensors fails; far too large wastes RAM you need for Wi-Fi. Read the reported arena use and add a margin.',
    'TFLM and ESP-DL are the same thing under two names — They are separate projects with different model formats and tools. A .tflite file does not run in ESP-DL, nor an Espressif model file in TFLM.'
  ],
  terms: [
    { term: 'TensorFlow Lite for Microcontrollers', also: ['TFLM', 'LiteRT for Microcontrollers', 'tflite-micro'], def: 'A C++ interpreter that runs a model on a microcontroller with no operating system and no dynamic memory allocation. Its model files have the .tflite extension.' },
    { term: 'Op resolver', also: ['operator resolver', 'MicroMutableOpResolver'], def: 'The list of operations (convolution, fully connected, softmax …) that the interpreter may run. Registering only the ones the model needs keeps the program small.' },
    { term: 'FlatBuffer', also: ['.tflite file', 'model file'], def: 'The file format of a TFLM model. It can be read in place without copying or parsing, so it can stay in flash as a constant array.' },
    { term: 'ESP-NN', also: ['esp-nn'], def: 'Espressif\'s library of optimised neural-network kernels (convolution, fully connected, pooling …). It is used under TFLM and is fastest where vector instructions exist.' },
    { term: 'ESP-DL', also: ['esp-dl', 'ESP-PPQ'], def: 'Espressif\'s own deep-learning inference library, with its own quantisation tool and model format. It runs models such as face detection and wake-word recognition.' }
  ],
  choose: {
    good: ['TFLM for a portable model that must run on several chips of the family', 'ESP-DL for Espressif\'s own vision or speech models on an S3 or P4', 'The ESP-IDF component route when you need the latest kernels'],
    avoid: ['Registering every operation "just in case": it bloats the program', 'Using the example arena size without measuring', 'Expecting MicroPython to load a .tflite file with an official module'],
    check: ['That every operation of the model is supported by the library version', 'The arena the interpreter reports it used', 'The time per Invoke() on your chip, with and without the optimised kernels']
  },
  code: [
    {
      title: 'Run a quantised model: the TFLM skeleton',
      about: 'The five steps in one sketch: embed the model, register three operations, create the interpreter with an arena, fill the input tensor, Invoke and print the scores. It assumes a small int8 classifier that uses fully connected, ReLU and softmax layers; it is a skeleton to adapt, not a model.',
      needs: 'An ESP32-S3 or any ESP32-family board; a TensorFlow Lite Micro library for your toolchain (for example the esp-tflite-micro component in an ESP-IDF project); a model_data.h made from your .tflite file with xxd -i.',
      blocks: `
        when started
          load model [model_data] :: ai
          set up interpreter with arena of (20) KB :: ai
          print (join [arena used: ] (arena bytes used) [ bytes]) :: ai

        every (1) seconds
          set input tensor from (features) :: ai
          run the model :: ai
          for each [k v] in (output classes)
            print (join [class ] (k) [: ] (score of class (k)))
          end
      `,
      cpp: String.raw`
        #include "model_data.h"                           // const unsigned char g_model[] = { ... };  made with: xxd -i model.tflite
        #include "tensorflow/lite/micro/micro_interpreter.h"
        #include "tensorflow/lite/micro/micro_mutable_op_resolver.h"
        #include "tensorflow/lite/schema/schema_generated.h"

        constexpr int ARENA_SIZE = 20 * 1024;             // start generous, then trim with arena_used_bytes()
        alignas(16) static uint8_t arena[ARENA_SIZE];

        static tflite::MicroMutableOpResolver<3> resolver;    // only the operations the model uses
        static tflite::MicroInterpreter *interpreter;
        TfLiteTensor *input, *output;

        void setup() {
          Serial.begin(115200);
          const tflite::Model *model = tflite::GetModel(g_model);
          if (model->version() != TFLITE_SCHEMA_VERSION) { Serial.println("model schema mismatch"); while (true) delay(1000); }
          resolver.AddFullyConnected();
          resolver.AddRelu();
          resolver.AddSoftmax();
          static tflite::MicroInterpreter staticInterpreter(model, resolver, arena, ARENA_SIZE);
          interpreter = &staticInterpreter;
          if (interpreter->AllocateTensors() != kTfLiteOk) { Serial.println("arena too small, or an operation is missing"); while (true) delay(1000); }
          input = interpreter->input(0);
          output = interpreter->output(0);
          Serial.printf("arena used: %u bytes\n", (unsigned)interpreter->arena_used_bytes());
        }

        void loop() {
          for (int i = 0; i < input->bytes; i++) {
            float x = 0.0f;                               // your feature i
            input->data.int8[i] = (int8_t)(x / input->params.scale + input->params.zero_point);
          }
          if (interpreter->Invoke() != kTfLiteOk) { Serial.println("Invoke failed"); return; }
          for (int k = 0; k < output->dims->data[output->dims->size - 1]; k++) {
            float score = (output->data.int8[k] - output->params.zero_point) * output->params.scale;
            Serial.printf("class %d: %.2f\n", k, score);
          }
          delay(1000);
        }
      `,
      na: { py: 'The official MicroPython images contain no TensorFlow Lite module. Community firmware builds that add TFLM as a native module exist, but they are separate builds, not the official ones; models are normally run from C++ or ESP-IDF.' },
      output: `
        arena used: 7312 bytes
        class 0: 0.02
        class 1: 0.95
        class 2: 0.03
      `,
      notes: ['The constructor and header names follow the current TFLM sources (the error-reporter argument of older versions is gone). They have changed between releases, so match them to the version of the library you install.', 'If AllocateTensors fails, raise ARENA_SIZE; if Invoke fails, an operation or a tensor type the library cannot run is the usual cause.', 'On the original ESP32 a static arena of more than about a hundred kilobytes may not link: allocate it with heap_caps_malloc at run time, in PSRAM if the model is large ([[using-psram]]).']
    }
  ],
  quiz: [
    { q: 'What does AllocateTensors() do in a TFLM program?', choices: ['Trains the model', 'Plans every tensor buffer inside the arena and fails if the arena is too small', 'Copies the model into RAM', 'Connects to Wi-Fi to fetch the weights'], a: 1, why: 'The interpreter works out, once, where each tensor lives inside the arena you gave it. After that, nothing is allocated while the model runs.' },
    { q: 'Start-up stops with "Didn\'t find op for builtin opcode". What is the likely cause?', choices: ['The arena is too big', 'The op resolver lacks an operation the model uses', 'The USB cable is faulty', 'The model is quantised'], a: 1, why: 'The op resolver lists the operations the interpreter may run. A model that uses an operation not registered cannot start; add the missing Add...() call.' },
    { q: 'The input tensor of an int8 model has scale 0.05 and zero point 0. A feature equals 1.0. What integer do you write?', choices: ['1', '20', '0.05', '127'], a: 1, why: 'q = x / scale + zero point = 1.0 / 0.05 + 0 = 20. Writing the raw value 1 would mean a real value of 0.05.' },
    { q: 'You have a .tflite file from a Keras model. Which library runs it?', choices: ['ESP-DL, directly', 'TensorFlow Lite Micro', 'Neither: it needs a server', 'Only MicroPython'], a: 1, why: 'The .tflite format is TFLM\'s. ESP-DL has its own format, produced by Espressif\'s tool from ONNX models.' }
  ],
  applications: [
    'Running a keyword-spotting or gesture model exported from TensorFlow on an ESP32 of any kind.',
    'A person-present classifier on a camera board, with ESP-NN kernels on the ESP32-S3.',
    'Face detection and recognition built on ESP-DL on an S3 or P4 board.',
    'A library exported by a hosted tool, which embeds TFLM or a similar engine inside it.'
  ],
  sources: [
    'The TensorFlow Lite for Microcontrollers documentation (LiteRT for Microcontrollers): the interpreter, the op resolver and the tensor arena.',
    'Espressif, the esp-tflite-micro and esp-nn repositories: the ESP-IDF component and the optimised kernels.',
    'Espressif, ESP-DL documentation: model conversion, quantisation and supported chips.'
  ],
  sim: 'ml-arena'
},

/* ================================================================ edge-impulse */
{
  id: 'edge-impulse',
  parent: 'tinyml',
  title: 'Edge Impulse',
  level: 2,
  short: 'A hosted pipeline that takes you from raw sensor data to a library you drop into your program: collect, label, choose features, train, test, export. It hides the Python and keeps the same steps.',
  keywords: ['Edge Impulse', 'impulse', 'studio', 'data forwarder', 'processing block', 'learning block', 'EON', 'confusion matrix', 'precision', 'recall', 'F1', 'run_classifier', 'inferencing', 'Arduino library', 'C++ library', 'anomaly score', 'model testing', 'transfer learning'],
  prereq: ['the-tinyml-pipeline', 'quantization', 'tflite-micro-and-esp-dl'],
  related: ['gesture-recognition', 'anomaly-detection', 'keyword-spotting', 'image-classification', 'privacy-and-data-protection'],
  body: `**Edge Impulse** is a web service that wraps the whole [pipeline](#/c/the-tinyml-pipeline) in a browser: you bring data, it trains a small model, tests it and gives you code. It is not Espressif's product and not the only way to do this, but it is popular on the ESP32 family because it shows each step plainly, and so makes a good way to learn what the steps are.

### What you do in it

1. **Collect data.** Your device streams samples to the service. The simplest route for any board: print each sample as a line of numbers separated by commas or tabs on the serial port, and run the data-forwarder tool on the computer, which uploads them with a label you type. Files can also be uploaded directly.
2. **Design an impulse.** An *impulse* is a *processing block* (the feature extraction: a spectrum for vibration and motion, a filterbank for audio, resizing for images) followed by a *learning block* (a classifier, a regressor or an anomaly detector).
3. **Train and test.** It trains on the training set and then scores the held-out test set, with a confusion matrix, and estimates the RAM, flash and time the model will need on a chosen target chip.
4. **Deploy.** It exports a C++ library or an Arduino library (a zip you add to the IDE), among other targets. The library contains both the feature code and the model, so training and chip use the same features — the "skew" trap of the pipeline page is avoided.

### Reading the confusion matrix

Each row is what really happened, each column what the model said. The diagonal is right; everything else is a mistake of a particular kind. From it come the two numbers that matter for a detector:

- **Precision** — of the times it said "wave", how often was it right?
- **Recall** — of the real waves, how many did it find?

Raising a threshold trades one for the other. The simulation builds a matrix from simulated gestures and shows how noise spreads the diagonal.

### Using the exported library

In your program you fill a buffer with one window of samples, wrap it in a signal, call \`run_classifier\` and read a score per label (and an anomaly score if the project has an anomaly block). The skeleton below shows the calls. The library is C++: there is no MicroPython export.

### Terms of use

Your data lives on someone else's server: read the terms, the plan limits and the licence of the exported code, and do not upload recordings of people without their consent ([[privacy-and-data-protection]]). The same pipeline can be run with free tools on your own computer; the service saves the setup, not the knowledge.

> [!key] Edge Impulse bundles collection, features, training, testing and export in a browser, and the library it exports contains both the feature code and the model. Judge the result by the confusion matrix on a test set, and remember that your data is on a third party's servers.`,
  ideas: [
    'An impulse is a processing block (features) followed by a learning block (classifier, regression or anomaly detection).',
    'Any board can feed data to it: print samples as numbers on the serial port and let the data-forwarder tool upload them.',
    'The exported library holds both the feature code and the model, so the chip computes the same features as the training.',
    'The confusion matrix shows which classes are mistaken for which; precision and recall come from it.'
  ],
  pitfalls: [
    'A hosted tool means I do not need to understand the steps — The steps are still yours: the quality of the data, the split and the choice of features decide the result. The service removes the setup, not the thinking.',
    '90 % accuracy overall means every class works — The average hides a class that is mostly wrong. Read the matrix row by row: a rare class can have poor recall while the overall score looks fine.',
    'The studio\'s accuracy is what the device will do — The test set may not match the real world. Run the exported library on the board, in the real place, and count the mistakes there.'
  ],
  terms: [
    { term: 'Impulse', also: ['Edge Impulse project design'], def: 'In Edge Impulse, the chain that turns raw data into an answer: a processing block that extracts features, then a learning block such as a classifier or an anomaly detector.' },
    { term: 'Data forwarder', also: ['edge-impulse-data-forwarder'], def: 'A command-line tool that reads lines of comma- or tab-separated numbers from a serial port and uploads them as labelled samples. Any board that prints numbers can use it.' },
    { term: 'Confusion matrix', also: ['error matrix'], def: 'A table of what the model predicted against what was true, one row per true class. The diagonal counts correct answers; every other cell is a particular kind of mistake.' },
    { term: 'Precision', also: ['positive predictive value'], def: 'Of all the examples the model labelled as a class, the fraction that really belong to it. Low precision means many false alarms.' },
    { term: 'Recall', also: ['sensitivity', 'true positive rate'], def: 'Of all the examples that really belong to a class, the fraction the model found. Low recall means missed events.' }
  ],
  choose: {
    good: ['Learning the workflow, or a first prototype of a sensor classifier', 'Teams who want the feature code and the model to stay in step', 'Projects where uploading the data to a third party is acceptable'],
    avoid: ['Data that is confidential, or recordings of people without consent', 'Needing a model type or a training trick the tool does not offer', 'Treating the exported library as certified or safety-rated'],
    check: ['The terms, plan limits and licence of the exported code', 'The per-class recall and precision, not only the overall accuracy', 'RAM, flash and time on the real board, measured']
  },
  code: [
    {
      title: 'Classify one window with an exported library',
      about: 'Calls the classifier of an Arduino library exported from a project: a buffer of raw samples goes in, one score per label comes out. The library name, the number of samples and the labels come from your project.',
      needs: 'An ESP32-family board and a library exported from your own Edge Impulse project (here called my_project_inferencing).',
      libs: ['my_project_inferencing (exported from your project)'],
      blocks: `
        when started
          start serial at (115200) baud

        every (2) seconds
          fill window buffer with (samples) :: ai
          classify window :: ai
          for each [label v] in (classes)
            print (join (label) [: ] (score of (label))) :: ai
          end
      `,
      cpp: String.raw`
        #include <my_project_inferencing.h>              // the name comes from your project

        static float features[EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE];    // one window of raw samples

        static int get_data(size_t offset, size_t length, float *out_ptr) {
          memcpy(out_ptr, features + offset, length * sizeof(float));
          return 0;
        }

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          // fill features[] with one window of samples here, in the same order and rate as the training data
          signal_t signal;
          int err = numpy::signal_from_buffer(features, EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE, &signal);
          if (err != 0) { Serial.println("signal setup failed"); delay(1000); return; }

          ei_impulse_result_t result = { 0 };
          EI_IMPULSE_ERROR res = run_classifier(&signal, &result, false);
          if (res != EI_IMPULSE_OK) { Serial.printf("classifier error %d\n", (int)res); delay(1000); return; }

          for (size_t i = 0; i < EI_CLASSIFIER_LABEL_COUNT; i++)
            Serial.printf("%s: %.2f\n", result.classification[i].label, result.classification[i].value);
          Serial.printf("(features %d ms, model %d ms)\n", (int)result.timing.dsp, (int)result.timing.classification);
          delay(2000);
        }
      `,
      na: { py: 'Edge Impulse exports C++ code (an Arduino library or a C++ library for ESP-IDF); there is no MicroPython export for the ESP32 family.' },
      output: `
        idle: 0.91
        shake: 0.03
        wave: 0.06
        (features 4 ms, model 1 ms)
      `,
      notes: ['The macros EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE and EI_CLASSIFIER_LABEL_COUNT are generated for your project, so the buffer always has the size the model expects.', 'The scores are the model\'s own confidence and are not probabilities in a strict sense: they must be checked on real data before you set a threshold.', 'A project with an anomaly block also fills result.anomaly, a score of how far the window is from anything seen in training ([[anomaly-detection]]).']
    }
  ],
  quiz: [
    { q: 'In a confusion matrix, where are the correct answers?', choices: ['In the first column', 'On the diagonal', 'In the last row', 'Everywhere except the diagonal'], a: 1, why: 'Rows are the true classes and columns the predictions, so the cell where they agree is on the diagonal. Every cell off the diagonal is a mistake.' },
    { q: 'A class "fault" has 10 real examples. The model finds 6 of them and also raises 6 false alarms. What are recall and precision for "fault"?', choices: ['Recall 60 %, precision 50 %', 'Recall 50 %, precision 60 %', 'Both 60 %', 'Recall 100 %, precision 60 %'], a: 0, why: 'Recall is found / real: 6 / 10 = 60 %. Precision is correct alarms / all alarms: 6 / (6 + 6) = 50 %.' },
    { q: 'Why does the exported library avoid the "feature skew" problem?', choices: ['It trains on the chip', 'It contains the feature code that was used in training, together with the model', 'It uses no features', 'It runs in the cloud'], a: 1, why: 'The same processing block is compiled into the library that the studio used for training, so the chip and the training see identically computed features.' },
    { q: 'You want to try Edge Impulse with recordings of your colleagues speaking. What should you do first?', choices: ['Upload them at once', 'Get their consent and read the service\'s terms and where the data is stored', 'Convert them to int8', 'Nothing: voice is not personal data'], a: 1, why: 'Voice recordings of people are personal data. Consent, the law where you live and the service\'s terms about storage and use all apply before anything is uploaded.' }
  ],
  applications: [
    'Prototyping a gesture or activity classifier from an accelerometer in an afternoon.',
    'Training an anomaly detector on a machine\'s normal vibration.',
    'Building a small keyword spotter from recorded words.',
    'Learning the pipeline end to end before moving to your own Python training scripts.'
  ],
  sources: [
    'Edge Impulse documentation: the studio, impulses, the data forwarder and the deployment options.',
    'Warden and Situnayake, *TinyML* (O\'Reilly): precision, recall and the confusion matrix for small classifiers.',
    'The Arduino IDE documentation: installing a library from a .zip file.'
  ],
  sim: 'ml-confusion'
},

/* ================================================================ keyword-spotting */
{
  id: 'keyword-spotting',
  parent: 'tinyml',
  title: 'Keyword spotting',
  level: 2,
  short: 'A chip that listens all day for one word cannot run a speech recogniser. It cuts the sound into short frames, takes the strength in a handful of frequency bands, and lets a small network judge a second of them.',
  keywords: ['keyword spotting', 'wake word', 'KWS', 'spectrogram', 'MFCC', 'mel filterbank', 'frames', 'I2S microphone', 'INMP441', 'micro_speech', 'Speech Commands', 'ESP-SR', 'WakeNet', 'MultiNet', 'false accept', 'false reject', 'threshold', 'voice activity detection', 'always-on'],
  prereq: ['i2s-microphones', 'fft-and-spectrum', 'the-tinyml-pipeline', 'quantization'],
  related: ['wake-words-and-speech-commands', 'voice-assistants', 'calling-cloud-ai', 'tflite-micro-and-esp-dl', 'gesture-recognition', 'ai-accelerators-s3-and-p4'],
  body: `Recognising the word "yes" is a different job from transcribing a sentence. The device only has to say, many times a second, "one of my few words was just spoken, or none was". That is small enough for a microcontroller, and it is the reason a smart speaker can listen all day on very little power and wake a much bigger system only when it hears its name.

### The chain

1. **Samples.** A MEMS microphone on an I2S bus delivers 16 000 numbers a second ([[i2s-microphones]]). That is 32 KB of data every second — far too much to hand to a network as it is.
2. **Frames.** The stream is cut into overlapping frames of about 30 ms, one every 20 ms.
3. **Spectrum.** Each frame is turned into the strength in a few dozen frequency bands, spaced the way hearing spaces them (a mel filterbank; its logarithm, further transformed, gives the MFCCs). One second becomes a picture of about 49 frames by 40 bands: a **spectrogram** of under 2000 numbers.
4. **Network.** A small convolutional or dense network reads that picture and produces a score per word, plus "silence" and "something else".
5. **Decision.** A word counts only if its score stays above a **threshold** — often for several frames in a row, because a single frame is noisy.

The simulation builds this chain from a synthetic signal so you can see each stage.

### Gates and cascades

Running the network all the time costs energy, so systems stack cheap gates before expensive stages: a loudness test first (the program below), then the wake-word network, then a larger recogniser of commands, and only then, if at all, a server ([[calling-cloud-ai]]). Espressif's ESP-SR library packages such a chain — audio front end, wake-word engine, fixed-vocabulary commands — for chips with PSRAM such as the ESP32-S3 and ESP32-P4; the TFLM micro_speech example does the same with a model of about twenty kilobytes that tells "yes" from "no".

### Training and trouble

Public data such as Google's Speech Commands (over 100 000 one-second clips of 35 words, from thousands of speakers) gets a first model going; a product needs recordings of your word in your noise, accents and rooms. The threshold is a trade-off: low and the device wakes at the television (**false accepts**), high and it ignores you (**false rejects**).

> [!warn] A microphone records people. Say where it is, who hears the result and what is stored, get consent from those it records, and follow your local law on recording and voice data.

> [!key] Keyword spotting turns sound into a small spectrogram and lets a tiny network score it, with a cheap loudness gate in front and a threshold with persistence behind. The threshold trades false accepts against false rejects, and real recordings in real noise decide whether it works.`,
  ideas: [
    'The sound is cut into frames of about 30 ms and each frame becomes the strength in a few dozen bands: a spectrogram of under 2000 numbers per second.',
    'A small network scores each word on that spectrogram; the decision needs a threshold and usually several frames in a row.',
    'Cheap gates (loudness, voice activity) sit before the network, and the network sits before any larger recogniser or server.',
    'The threshold trades false accepts against false rejects; no setting removes both.'
  ],
  pitfalls: [
    'A keyword spotter understands speech — It only decides, from a pattern of sound, which of a handful of trained words was likely spoken. It knows nothing else, and a similar-sounding word can fool it.',
    'Training on clean studio clips is enough — A device in a kitchen hears fans, music and other speakers. Train and test with recordings made in the real place, with real noise, and several voices.',
    'One high-scoring frame means the word was said — A single frame is noisy. Require the score to stay above the threshold for several frames, or average over a short window, before acting.'
  ],
  terms: [
    { term: 'Keyword spotting', also: ['KWS', 'wake word detection'], def: 'Detecting a small set of spoken words in a continuous audio stream. A small network scores the latest second of sound for each word, many times a second.' },
    { term: 'Spectrogram', also: ['filterbank features', 'mel spectrogram'], def: 'A picture of sound: one column per short frame, one row per frequency band, brightness for strength. It is what the network reads instead of the raw samples.' },
    { term: 'MFCC', also: ['mel-frequency cepstral coefficients'], def: 'A compact set of numbers describing the shape of a frame\'s spectrum on a scale that follows hearing. A long-standing feature for speech.' },
    { term: 'False accept', also: ['false positive', 'false wake'], def: 'The device reacts although the word was not said — it wakes at the television. A lower threshold causes more of them.' },
    { term: 'False reject', also: ['false negative', 'missed wake'], def: 'The word was said and the device did not react. A higher threshold causes more of them.' }
  ],
  choose: {
    good: ['A few fixed words or commands, spoken close to the device', 'Always-listening devices where only the wake word may leave the house', 'Offline voice control with a small vocabulary'],
    avoid: ['Open vocabulary or free dictation: that is a job for a server', 'A single microphone in a very loud room with no training in that noise', 'Recording or sending audio without the consent of the people in the room'],
    check: ['False accepts per hour and false rejects at your threshold, measured in place', 'RAM and time per inference on the chip you use', 'What the device records, stores and sends, and who knows about it']
  },
  code: [
    {
      title: 'A loudness gate for the microphone',
      about: 'Reads 16 ms of audio at a time from an I2S microphone, measures how loud it is and reports "sound" only when three frames in a row are above a threshold. This is the cheap first stage that decides when the real network should run.',
      needs: 'An ESP32 DevKit and an INMP441-type I2S microphone with its L/R pin to GND.',
      wiring: [['GPIO32', 'microphone SCK (bit clock)'], ['GPIO25', 'microphone WS (word select)'], ['GPIO33', 'microphone SD (data out)'], ['3V3 / GND', 'microphone power']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2S microphone at (16000) Hz on SCK (32) WS (25) SD (33) :: sound
          set [loud v] to (0)

        forever
          set [level v] to (loudness of next (256) samples) :: sound
          if <(level) > (30000)> then
            change [loud v] by (1)
          else
            set [loud v] to (0)
          end
          if <(loud) = (3)> then
            print (join [sound, level ] (level))
          end
        end
      `,
      cpp: String.raw`
        #include <ESP_I2S.h>

        I2SClass i2s;
        const int PIN_BCLK = 32, PIN_WS = 25, PIN_DIN = 33;
        const int N = 256;                       // 16 ms at 16 kHz
        const float THRESHOLD = 30000;           // tune for your room: quiet reads a few thousand
        int32_t buf[N];
        int loud = 0;

        void setup() {
          Serial.begin(115200);
          i2s.setPins(PIN_BCLK, PIN_WS, -1, PIN_DIN);
          if (!i2s.begin(I2S_MODE_STD, 16000, I2S_DATA_BIT_WIDTH_32BIT, I2S_SLOT_MODE_MONO)) {
            Serial.println("I2S init failed");
            while (true) delay(1000);
          }
        }

        void loop() {
          size_t got = i2s.readBytes((char *)buf, sizeof(buf));
          if (got < sizeof(buf)) return;
          double sum = 0, sumSq = 0;
          for (int i = 0; i < N; i++) { double v = buf[i] >> 8; sum += v; sumSq += v * v; }    // the 24-bit sample
          float rms = sqrt(sumSq / N - (sum / N) * (sum / N));                                  // loudness without the DC offset
          loud = rms > THRESHOLD ? loud + 1 : 0;
          if (loud == 3) Serial.printf("sound, level %.0f\n", rms);                             // run the real network here
        }
      `,
      py: String.raw`
        from machine import I2S, Pin
        import struct, math

        N = 256                                    # 16 ms at 16 kHz
        THRESHOLD = 30000                          # tune for your room: quiet reads a few thousand
        mic = I2S(0, sck=Pin(32), ws=Pin(25), sd=Pin(33), mode=I2S.RX, bits=32,
                  format=I2S.MONO, rate=16000, ibuf=20000)
        buf = bytearray(N * 4)
        loud = 0

        while True:
            if mic.readinto(buf) < len(buf):
                continue
            s = [v >> 8 for v in struct.unpack("<256i", buf)]      # the 24-bit samples
            mean = sum(s) / N
            rms = math.sqrt(sum(v * v for v in s) / N - mean * mean)   # loudness without the DC offset
            loud = loud + 1 if rms > THRESHOLD else 0
            if loud == 3:
                print("sound, level %d" % rms)                     # run the real network here
      `,
      output: `
        sound, level 41873
        sound, level 52116
      `,
      notes: ['The INMP441 sends 24-bit samples in a 32-bit slot, so the program reads 32-bit words and shifts them down by 8. Its L/R pin selects the left or the right slot: tie it to ground for the left, which mono mode reads.', 'The threshold of 30000 is on a scale of up to 8 million (24 bits); a quiet room reads a few thousand, speech close to the microphone tens of thousands. Watch the printed levels for your own room before choosing a value.', 'In MicroPython the loop computes in Python and is slow; at 16 kHz it may fall behind. That is acceptable for a gate and a reason why real keyword spotting is C++ ([[i2s-microphones]]).']
    }
  ],
  examples: [
    {
      title: 'How big is the picture the network sees?',
      q: 'A keyword spotter looks at 1 s of audio, with frames of 30 ms taken every 20 ms and 40 bands per frame. How many frames and how many numbers is that, and how does it compare with the raw samples at 16 kHz?',
      steps: ['Frames: $(1000 - 30) / 20 + 1 = 49.5$, so 49 whole frames.', 'Numbers: $49 \\cdot 40 = 1960$.', 'Raw samples in the same second: 16 000, at 16 bits each, 32 KB. The picture is 1960 numbers, about eight times fewer, and as int8 it is under 2 KB.', 'The network therefore never sees the sound itself, only its shape in time and frequency.'],
      a: '49 frames and 1960 numbers per second of sound, against 16 000 raw samples: the feature step shrinks the input about eightfold before the network starts.'
    }
  ],
  formulas: [
    {
      name: 'Frames in a window of sound',
      expr: 'N = (T - w)/h + 1',
      tex: 'N = \\frac{T - w}{h} + 1',
      vars: {
        N: { name: 'number of frames (round down)', q: 'count' },
        T: { name: 'length of the audio window', q: 'time', unit: 'ms', value: 1000, min: 1 },
        w: { name: 'length of one frame', q: 'time', unit: 'ms', value: 30, min: 1 },
        h: { name: 'hop: time between the starts of frames', q: 'time', unit: 'ms', value: 20, min: 1 }
      },
      solveFor: 'N',
      note: 'Only whole frames count, so round the result down. The picture the network reads has N columns, one per frame, and as many rows as there are bands.',
      stories: { N: 'A window of {T} is cut into frames of {w} every {h}. How many frames are there (round down)?' }
    }
  ],
  quiz: [
    { q: 'Why not feed the 16 000 raw samples of each second straight into the network?', choices: ['The microphone is too noisy', 'It is far more numbers than needed; a spectrogram carries the useful shape in about eight times fewer', 'Networks cannot read samples', 'The samples are encrypted'], a: 1, why: 'Raw audio is a long, detailed waveform. A spectrogram keeps the pattern of strength over time and frequency that distinguishes words, in under 2000 numbers per second, so the network can be tiny.' },
    { q: 'The device wakes up when the television plays. Which change makes false accepts less frequent?', choices: ['Lower the threshold', 'Raise the threshold or require several frames in a row', 'Sample at a lower rate', 'Use a bigger battery'], a: 1, why: 'A higher threshold, or persistence over several frames, makes a wake-up need stronger evidence. The price is more false rejects, so measure both.' },
    { q: 'What is the purpose of the loudness gate in front of the network?', choices: ['To make the network more accurate', 'To save energy by running the expensive stage only when there is sound', 'To record the audio', 'To replace the microphone'], a: 1, why: 'Measuring loudness costs almost nothing, while running the network every 20 ms uses real energy. A cascade of cheap gates before costly stages keeps an always-on device efficient.' },
    { q: 'A model that tells "yes" from "no" scored 95 % on clean test clips. On the kitchen counter it fails often. What is the likeliest reason?', choices: ['The clips were too short', 'The training and test data did not contain kitchen noise and the real voices', 'The chip is too fast', 'The threshold is exactly 0.5'], a: 1, why: 'The model has only learned the conditions it was trained on. Record in the real place, with its noise and its speakers, and test there.' }
  ],
  applications: [
    'Hands-free commands such as "on" and "off" for a lamp or a fan, with no cloud.',
    'The local wake word of a voice assistant, with a server only after the word is heard.',
    'Door and appliance controls that must work offline.',
    'Hearing-style monitoring: detecting a glass breaking or a smoke alarm by its sound.'
  ],
  sources: [
    'Warden, "Speech Commands: A Dataset for Limited-Vocabulary Speech Recognition" (2018): the data set and the task.',
    'The TensorFlow Lite for Microcontrollers micro_speech example: a small keyword spotter end to end.',
    'Espressif, ESP-SR documentation: the audio front end, wake-word and command recognition.'
  ],
  sim: 'ml-kws'
},

/* ================================================================ gesture-recognition */
{
  id: 'gesture-recognition',
  parent: 'tinyml',
  title: 'Gestures from an accelerometer',
  level: 2,
  short: 'An accelerometer gives three numbers fifty times a second. A gesture is a shape in those numbers over a second or two — a rhythm, a burst, a tilt — and a few summary figures per axis are often enough to tell the gestures apart.',
  keywords: ['gesture recognition', 'activity recognition', 'accelerometer', 'IMU', 'MPU-6050', 'window', 'sampling rate', 'features', 'RMS', 'peak-to-peak', 'zero crossings', 'orientation', 'wave', 'shake', 'wearable', 'magic wand', 'wake on motion', 'FIFO'],
  prereq: ['motion-sensors-imu', 'i2c', 'the-tinyml-pipeline'],
  related: ['edge-impulse', 'anomaly-detection', 'tflite-micro-and-esp-dl', 'hardware-timers', 'sample-time-and-jitter', 'filtering-sensor-data', 'keyword-spotting'],
  body: `A three-axis accelerometer measures acceleration along x, y and z. At rest it reads gravity — 1 g pointing down — which tells you how the board is tilted; when you move it, the motion adds to that. A **gesture** is a recognisable pattern in those three streams over a second or two: a wave is a regular swing on one axis, a shake is a violent burst on all three, a circle is two axes swinging a quarter of a cycle apart, and "idle" is almost nothing.

### From samples to an answer

1. **Sample at a steady rate.** Hand motion has most of its energy below 10–15 Hz, so 50 to 100 samples a second is plenty. The rate must be *steady*: jitter smears the pattern ([[sample-time-and-jitter]]). Use a timer or a fixed deadline, not \`delay()\`.
2. **Cut a window.** One to two seconds: at 50 Hz, 50 to 100 samples per axis, 150 to 300 numbers, 300 to 600 bytes as 16-bit values. Windows usually overlap by half so that a gesture is not cut in two.
3. **Compute features.** For each axis: the **mean** (which way gravity points, so the orientation), the **spread** or RMS about the mean (how much it moves), the **peak-to-peak** value (how violent), and perhaps the dominant frequency or the number of zero crossings (how rhythmic).
4. **Classify.** A small network, a decision tree or even the nearest of a few average patterns. Always include an "idle" class, or the model will invent a gesture whenever you move.
5. **Decide.** Act when the same class wins on a few windows in a row.

The simulation draws the three traces of each gesture, the features computed from them and the score of every class; add noise and shorten the window to see where the classes start to blur.

### What goes wrong

- **Orientation.** A model trained with the board held one way fails when it is held another. Record in several orientations, or use features that do not depend on gravity's direction.
- **People.** One person's wave is another's shake. Record several people, and keep each person's recordings together when splitting ([[the-tinyml-pipeline]]).
- **Always listening.** Keeping the CPU awake to sample costs energy. Many sensors have a wake-on-motion output and a FIFO that collects samples while the processor sleeps; some even carry a small classifier of their own.

### The sensor

The common MPU-6050 sits at I2C address 0x68 and starts in sleep: write 0 to register 0x6B to wake it. At its default range of ±2 g one count is 1/16384 g. Its six readout bytes (x, y, z, high byte first) start at register 0x3B ([[motion-sensors-imu]]).

> [!key] A gesture is a pattern over a window of accelerometer samples taken at a steady rate. A handful of per-axis features — mean, spread, peak-to-peak — plus an idle class often separate the gestures, and orientation, people and jitter are what break a model.`,
  ideas: [
    'Sample at 50 to 100 Hz on a steady schedule and cut windows of one to two seconds, overlapping by half.',
    'Per axis, the mean gives orientation, the spread and peak-to-peak give energy, and the zero crossings or dominant frequency give rhythm.',
    'Always include an idle class, and require the same answer on a few windows in a row before acting.',
    'Orientation, different people and sample-rate jitter are the usual reasons a gesture model fails outside the lab.'
  ],
  pitfalls: [
    'A faster sample rate always gives better recognition — Hand gestures live below about 15 Hz. Sampling at 1 kHz just fills RAM and time with numbers that carry nothing. Choose the rate from the fastest motion you need to see.',
    'The model works when I hold the board the way I did when recording — Gravity adds a constant that depends on orientation. If you recorded in one orientation, other orientations look like different gestures. Vary the holding angle in the data.',
    'delay(20) gives a 50 Hz sample rate — The loop also takes time to read the sensor and compute, so the real rate is lower and varies. Schedule samples from a fixed deadline or a hardware timer.'
  ],
  terms: [
    { term: 'Window', also: ['sliding window', 'frame of samples'], def: 'A fixed-length stretch of the sample stream — here one to two seconds — that is turned into features and classified. Windows normally overlap so a gesture is not cut in two.' },
    { term: 'Accelerometer', also: ['IMU', 'inertial measurement unit'], def: 'A sensor that measures acceleration on three axes, including gravity. An IMU adds a gyroscope that measures rotation, and sometimes a magnetometer.' },
    { term: 'Peak-to-peak', also: ['p2p', 'range'], def: 'The difference between the largest and the smallest value in a window. A simple measure of how violent a movement was.' },
    { term: 'Sampling rate', also: ['sample rate', 'ODR'], def: 'How many readings are taken per second. It must be at least twice the highest frequency of interest, and it must stay steady.' },
    { term: 'Wake on motion', also: ['motion interrupt', 'WoM'], def: 'A feature of many IMUs: the sensor itself watches for movement and raises a pin, so the microcontroller can sleep until something happens.' }
  ],
  choose: {
    good: ['A small set of distinct movements with an idle class', 'Wearables and handheld controllers where the sensor moves with the hand', 'Cheap classification with a few features and a tiny model'],
    avoid: ['Gestures that differ only in tiny finger motion at the wrist', 'A device whose mounting or orientation changes between uses, with no data for it', 'Sampling through delay() and trusting the rate'],
    check: ['Accuracy on recordings from people who were not in the training data', 'The real sample rate, measured with a timer', 'False triggers during ordinary movement, not only missed gestures']
  },
  code: [
    {
      title: 'Collect one second of motion and compute its features',
      about: 'Reads an MPU-6050 at 50 Hz for one second, then prints one line of nine numbers: the mean, the spread and the peak-to-peak of x, y and z. A line like this is a training example; the same code can feed a classifier on the chip.',
      needs: 'An ESP32 DevKit and an MPU-6050 breakout (address 0x68).',
      wiring: [['GPIO21', 'MPU-6050 SDA'], ['GPIO22', 'MPU-6050 SCL'], ['3V3 / GND', 'MPU-6050 power']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22)
          I2C write (0) to address (0x68) register (0x6B)

        forever
          delete all of [window v]
          repeat (50)
            add (accelerometer x, y, z in g from address (0x68)) to [window v]
            wait (0.02) seconds
          end
          print (join (mean of [window v]) [,] (spread of [window v]) [,] (peak-to-peak of [window v]))
        end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21, SCL_PIN = 22;
        const uint8_t MPU = 0x68;                    // MPU-6050 with AD0 low
        const int N = 50;                            // 50 samples = 1 s at 50 Hz
        const uint32_t PERIOD_MS = 20;
        float win[3][N];

        void readAccel(float *out) {
          Wire.beginTransmission(MPU);
          Wire.write(0x3B);                          // ACCEL_XOUT_H: six bytes follow, high byte first
          Wire.endTransmission(false);
          Wire.requestFrom(MPU, (size_t)6);
          for (int a = 0; a < 3; a++) {
            int16_t hi = Wire.read();
            int16_t raw = (hi << 8) | Wire.read();
            out[a] = raw / 16384.0f;                 // +-2 g range: 16384 counts per g
          }
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(SDA_PIN, SCL_PIN, 400000);
          Wire.beginTransmission(MPU);
          Wire.write(0x6B); Wire.write(0);           // PWR_MGMT_1 = 0: wake from sleep
          Wire.endTransmission();
        }

        void loop() {
          uint32_t t = millis();
          for (int i = 0; i < N; i++) {
            float s[3];
            readAccel(s);
            for (int a = 0; a < 3; a++) win[a][i] = s[a];
            t += PERIOD_MS;
            while ((int32_t)(millis() - t) < 0) {}   // a fixed deadline keeps the rate steady
          }
          for (int a = 0; a < 3; a++) {
            float sum = 0, lo = win[a][0], hi = win[a][0];
            for (int i = 0; i < N; i++) { sum += win[a][i]; lo = fminf(lo, win[a][i]); hi = fmaxf(hi, win[a][i]); }
            float mean = sum / N, var = 0;
            for (int i = 0; i < N; i++) var += (win[a][i] - mean) * (win[a][i] - mean);
            Serial.printf("%.3f,%.3f,%.3f%s", mean, sqrtf(var / N), hi - lo, a < 2 ? "," : "\n");
          }
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import struct, time, math

        MPU = 0x68                                   # MPU-6050 with AD0 low
        N = 50                                       # 50 samples = 1 s at 50 Hz
        PERIOD_MS = 20
        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
        i2c.writeto_mem(MPU, 0x6B, b"\x00")          # PWR_MGMT_1 = 0: wake from sleep

        def read_accel():
            raw = i2c.readfrom_mem(MPU, 0x3B, 6)     # ACCEL_XOUT_H: six bytes, high byte first
            return [v / 16384 for v in struct.unpack(">hhh", raw)]    # +-2 g range: 16384 counts per g

        def features(v):
            mean = sum(v) / len(v)
            std = math.sqrt(sum((x - mean) ** 2 for x in v) / len(v))
            return mean, std, max(v) - min(v)

        while True:
            t = time.ticks_ms()
            win = []
            for _ in range(N):
                win.append(read_accel())
                t = time.ticks_add(t, PERIOD_MS)
                while time.ticks_diff(t, time.ticks_ms()) > 0:    # a fixed deadline keeps the rate steady
                    pass
            row = []
            for a in range(3):
                row += features([s[a] for s in win])
            print(",".join("%.3f" % x for x in row))
      `,
      output: `
        -0.012,0.004,0.021,0.031,0.005,0.027,0.998,0.006,0.034
        0.114,0.512,1.804,-0.206,0.087,0.402,0.953,0.211,0.911
      `,
      notes: ['The first line is the board lying still (almost nothing moves, z reads 1 g); the second is a wave (a large spread on x). The nine numbers are mean, spread and peak-to-peak for x, then y, then z.', 'The default range is ±2 g, which clips a hard shake; for violent gestures set the sensor to ±8 g (register 0x1C) and divide by 4096 instead.', 'Print the same row from the chip to train on (labelled, with the capture program of the pipeline page), then feed the same row to a classifier: the features stay identical.']
    }
  ],
  examples: [
    {
      title: 'How big is a window?',
      q: 'Gestures are sampled at 50 Hz on three axes, 16 bits per value, in windows of 2 s that overlap by half. How many samples, how many bytes per window, and how often does a new window complete?',
      steps: ['Samples per axis: $50\\,\\mathrm{Hz} \\cdot 2\\,\\mathrm{s} = 100$.', 'Values: $100 \\cdot 3 = 300$; at 2 bytes each, 600 bytes per window.', 'Half overlap means a new window every 1 s, so the classifier runs once a second.'],
      a: '100 samples per axis, 600 bytes per window, one classification per second.'
    }
  ],
  formulas: [
    {
      name: 'Samples in a window',
      expr: 'n = f*T',
      tex: 'n = f\\, T',
      vars: {
        n: { name: 'samples per axis in the window', q: 'count' },
        f: { name: 'sampling rate', q: 'frequency', unit: 'Hz', value: 50, min: 1 },
        T: { name: 'length of the window', q: 'time', unit: 's', value: 2, min: 0.01 }
      },
      solveFor: 'n',
      note: 'Multiply by the number of axes and the bytes per value for the memory of one window. The sampling rate must be at least twice the highest frequency in the motion.',
      stories: { n: 'An accelerometer is sampled at {f} and the window lasts {T}. How many samples per axis does it hold?' }
    }
  ],
  quiz: [
    { q: 'A board lies on a table. What do the three axes of an accelerometer read, roughly?', choices: ['0, 0, 0', '0, 0 and 1 g on the axis pointing up or down', '1 g on every axis', 'It depends on the temperature'], a: 1, why: 'Gravity is always there: the axis pointing along it reads about 1 g and the others about 0. This is why the mean of each axis tells the orientation.' },
    { q: 'Why include an "idle" class?', choices: ['To save flash', 'So the model has a right answer when nothing is happening instead of inventing a gesture', 'To make the window shorter', 'Because the sensor needs it'], a: 1, why: 'A classifier must pick one of its classes. Without "idle" (and "other movement"), ordinary motion is forced into the nearest gesture and causes false triggers.' },
    { q: 'You sample with delay(20) in the loop, and each pass also spends 6 ms reading and computing. What is the real rate?', choices: ['50 Hz', 'About 38 Hz, and it varies', '20 Hz', '1 kHz'], a: 1, why: 'Each pass takes about 26 ms, so about 38 samples a second, and the exact time varies with the work. Use a fixed deadline or a hardware timer so that the rate is what you think it is.' },
    { q: 'A wave gesture is trained with the board flat. In use the board is held upright. What happens to the means of the axes?', choices: ['Nothing', 'They change, because gravity now points along a different axis', 'They all become zero', 'The sensor resets'], a: 1, why: 'The mean of each axis contains gravity\'s share, which depends on orientation. A model that relied on those means sees a different pattern. Record in several orientations or use features that ignore the mean.' }
  ],
  applications: [
    'Wands and handheld controllers that recognise a few motions.',
    'Wearables that tell walking, running and resting apart.',
    'Tools that detect being picked up, shaken or dropped.',
    'Exercise counters that count repetitions from the rhythm of the motion.'
  ],
  sources: [
    'The MPU-6000 and MPU-6050 product specification and register map (TDK InvenSense): the registers used above.',
    'The TensorFlow Lite for Microcontrollers magic wand example: a small gesture classifier from accelerometer data.',
    'Warden and Situnayake, *TinyML* (O\'Reilly): gesture recognition with an accelerometer.'
  ],
  sim: 'ml-gesture'
},

/* ================================================================ anomaly-detection */
{
  id: 'anomaly-detection',
  parent: 'tinyml',
  title: 'Anomaly detection',
  level: 2,
  short: 'Failures are rare, so you seldom have examples of them. An anomaly detector learns what normal looks like and raises its voice when something is far from it: a bearing starting to rattle, a fan with a loose blade.',
  keywords: ['anomaly detection', 'predictive maintenance', 'vibration', 'novelty detection', 'z-score', 'standard deviation', 'threshold', 'false alarm', 'K-means', 'autoencoder', 'reconstruction error', 'drift', 'persistence', 'condition monitoring', 'unsupervised'],
  prereq: ['the-tinyml-pipeline', 'motion-sensors-imu', 'analog-input'],
  related: ['gesture-recognition', 'edge-impulse', 'filtering-sensor-data', 'esp-as-a-data-logger', 'fft-and-spectrum', 'sleep-and-low-power'],
  body: `A classifier needs examples of every class. A machine that fails once in two years offers none. An **anomaly detector** turns the problem round: it learns only what *normal* looks like, from hours of normal running, and measures how far each new moment is from that picture. A far-off moment is an anomaly. It cannot say *what* is wrong, only that something is different — which is often all you need to look.

### How it is done

1. **Sense** vibration, sound or current with an accelerometer, a microphone or a current sensor.
2. **Window and extract features**: the strength (RMS), and the energy in a few frequency bands — the fundamental of the rotation, a harmonic, a high band where bearing noise appears.
3. **Learn normal**: the mean and the spread of each feature over normal data, or clusters of normal behaviour (K-means), or a small network trained to rebuild normal windows (an *autoencoder*) whose rebuild error rises for unfamiliar ones.
4. **Score**: for the simplest model, each feature's distance from its normal mean in units of its standard deviation, the **z-score**, combined into one number.
5. **Decide**: alarm when the score exceeds a threshold for several windows in a row.

The simulation runs this on a synthetic motor: normal running, then a fault that you scale from faint to loud.

### The threshold is a false-alarm budget

If normal values scatter like a bell curve, a window lies beyond $k$ standard deviations (either side) with probability $1 - \\mathrm{erf}(k/\\sqrt{2})$: 0.27 % for $k = 3$. That sounds small. At four windows a second there are 345 600 windows a day, and 0.27 % of them is **about 930 false alarms every day**. At $k = 5$ it is about one every five days. So thresholds are set high, and a few windows in a row are required — which also delays detection by the same few windows. Choose the threshold from the false-alarm rate you can live with, not from a feeling.

### Why detectors stop working

- **Normal drifts**: temperature, load, wear and season change what "normal" is. Retrain periodically, or let the model follow slowly (carefully: it can learn the fault as normal).
- **Not all normal was recorded**: idle, loaded, hot and cold are all normal; a mode missing from the training data looks like a fault.
- **Remounting the sensor** changes every number.
- **The sensor must see the fault**: a sensor that stops at a few hundred hertz cannot see a fault that sits at several kilohertz.

An anomaly detector is advice for a maintenance person, not a safety function. Do not let it be the only thing between a machine and an injury.

> [!key] An anomaly detector learns only normal behaviour and scores each window by its distance from it. The threshold is a false-alarm budget — 3 sigma at four windows a second gives hundreds of false alarms a day — so set it high, require persistence and retrain as normal drifts.`,
  ideas: [
    'It learns normal from normal data alone, so it works when failures are too rare to collect.',
    'The simplest model scores each feature by its z-score: the distance from the normal mean in standard deviations.',
    'A threshold at 3 sigma sounds strict but gives hundreds of false alarms a day when windows come several times a second.',
    'Normal drifts and has several modes; the detector needs data from all of them and fresh data over time.'
  ],
  pitfalls: [
    'An anomaly detector tells me what is broken — It says only that the present differs from what it learned as normal. A new but harmless working mode looks just like a fault. Diagnosis needs a person or a classifier trained on labelled faults.',
    'Three standard deviations is a strict threshold — For a bell curve it is crossed in 0.27 % of windows, which at several windows a second means many false alarms a day. Use a higher threshold and require several windows in a row.',
    'Train it once and forget it — Wear, temperature and season shift normal. A model trained in winter can alarm all summer. Plan retraining or a slow adaptation, and check how it behaves after maintenance.'
  ],
  terms: [
    { term: 'Anomaly detection', also: ['novelty detection', 'outlier detection'], def: 'Flagging data that is far from what was learned as normal. It needs only normal examples, so it suits failures that are too rare to collect.' },
    { term: 'Z-score', also: ['standard score', 'sigma distance'], def: 'How many standard deviations a value lies from the normal mean: z = (x − μ) / σ. A z of 4 means four standard deviations away.' },
    { term: 'Autoencoder', also: ['reconstruction error'], def: 'A small network trained to rebuild its own input through a narrow middle. Windows unlike the training data are rebuilt badly, and the size of that error is the anomaly score.' },
    { term: 'Concept drift', also: ['drift', 'data drift'], def: 'The slow change of what is normal — wear, temperature, load or season — that makes a fixed model go stale.' },
    { term: 'Persistence', also: ['debounce', 'N in a row'], def: 'Requiring the score to stay above the threshold for several windows in a row before raising an alarm. It removes isolated spikes at the cost of a short delay.' }
  ],
  choose: {
    good: ['Machines with periodic vibration or sound, where faults are rare', 'A first level of condition monitoring that tells a person to look', 'Cases where only normal data exists'],
    avoid: ['Using it as a safety function', 'Training on a few minutes of one working mode', 'A sensor too slow or too badly mounted to see the fault'],
    check: ['The false alarms per day on a long run of normal data', 'The delay between the fault starting and the alarm', 'How often normal has to be re-learned']
  },
  code: [
    {
      title: 'Learn what normal is, then flag what is not',
      about: 'For the first five seconds the program measures the strength of a signal (the RMS about its mean, per 100 ms window) and learns the mean and spread of that figure. After that it computes the z-score of every window and raises an alarm when three windows in a row are more than four standard deviations away, on either side.',
      needs: 'An ESP32 DevKit and an analogue sensor on GPIO34: a microphone module with analogue output, or a vibration or piezo sensor with a bias circuit that centres it at about half the supply.',
      wiring: [['GPIO34', 'sensor output', 'an ADC1 pin'], ['3V3 / GND', 'sensor supply']],
      blocks: `
        when started
          start serial at (115200) baud
          set [learned v] to (0)
          set [over v] to (0)
          print [learning what normal looks like...]

        every (0.1) seconds
          set [f v] to (strength of (100) analog readings on pin (34)) :: ai
          if <(learned) < (50)> then
            add (f) to [normal v]
            change [learned v] by (1)
          else
            set [z v] to ((f) - (mean of [normal v])) / (max ((std of [normal v])) (1))
            if <(abs (z)) > (4)> then
              change [over v] by (1)
            else
              set [over v] to (0)
            end
            if <(over) = (3)> then
              print (join [ANOMALY, z = ] (z))
            end
          end
      `,
      cpp: String.raw`
        const int SENSOR_PIN = 34;            // ADC1
        const int WINDOW = 100;               // samples per window: 100 ms at 1 kHz
        const int LEARN_WINDOWS = 50;         // 5 s of normal behaviour
        const float K = 4.0;                  // alarm beyond 4 standard deviations ...
        const int NEED = 3;                   // ... for 3 windows in a row

        float sum = 0, sumSq = 0;
        int learned = 0, over = 0;

        float windowStrength() {              // RMS about the mean: how much the signal moves
          float s = 0, s2 = 0;
          uint32_t t = micros();
          for (int i = 0; i < WINDOW; i++) {
            float v = analogRead(SENSOR_PIN);
            s += v; s2 += v * v;
            t += 1000;                        // 1 kHz
            while ((int32_t)(micros() - t) < 0) {}
          }
          float mean = s / WINDOW;
          return sqrtf(fmaxf(0.0f, s2 / WINDOW - mean * mean));
        }

        void setup() {
          Serial.begin(115200);
          Serial.println("learning what normal looks like...");
        }

        void loop() {
          float f = windowStrength();
          if (learned < LEARN_WINDOWS) {
            sum += f; sumSq += f * f; learned++;
            return;
          }
          float mu = sum / LEARN_WINDOWS;
          float sigma = fmaxf(sqrtf(fmaxf(0.0f, sumSq / LEARN_WINDOWS - mu * mu)), 1.0f);   // never divide by zero
          float z = (f - mu) / sigma;
          over = (fabsf(z) > K) ? over + 1 : 0;
          if (over == NEED) Serial.printf("ANOMALY: strength %.1f, z = %.1f\n", f, z);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time, math

        SENSOR = ADC(Pin(34), atten=ADC.ATTN_11DB)   # ADC1
        WINDOW = 100                                  # samples per window: 100 ms at 1 kHz
        LEARN_WINDOWS = 50                            # 5 s of normal behaviour
        K = 4.0                                       # alarm beyond 4 standard deviations ...
        NEED = 3                                      # ... for 3 windows in a row

        def window_strength():                        # RMS about the mean: how much the signal moves
            s = s2 = 0
            t = time.ticks_us()
            for _ in range(WINDOW):
                v = SENSOR.read_u16() >> 4            # 12-bit reading, 0..4095
                s += v
                s2 += v * v
                t = time.ticks_add(t, 1000)           # 1 kHz
                while time.ticks_diff(t, time.ticks_us()) > 0:
                    pass
            mean = s / WINDOW
            return math.sqrt(max(0.0, s2 / WINDOW - mean * mean))

        print("learning what normal looks like...")
        total = total_sq = 0
        for _ in range(LEARN_WINDOWS):
            f = window_strength()
            total += f
            total_sq += f * f
        mu = total / LEARN_WINDOWS
        sigma = max(math.sqrt(max(0.0, total_sq / LEARN_WINDOWS - mu * mu)), 1.0)   # never divide by zero

        over = 0
        while True:
            f = window_strength()
            z = (f - mu) / sigma
            over = over + 1 if abs(z) > K else 0
            if over == NEED:
                print("ANOMALY: strength %.1f, z = %.1f" % (f, z))
      `,
      output: `
        learning what normal looks like...
        ANOMALY: strength 96.4, z = 9.7
      `,
      notes: ['The standard deviation is floored at 1 count so that an unusually quiet learning period cannot make the detector hypersensitive. Learn over a typical stretch of normal running, including every normal mode.', 'The alarm prints once when the third window arrives and not again until the signal has returned to normal and left it a second time; that is a design choice you may change.', 'Use the same loop with a richer feature (the strength in two or three frequency bands) and a distance over all features for a sharper detector ([[fft-and-spectrum]]).']
    }
  ],
  examples: [
    {
      title: 'The false alarms of a threshold',
      q: 'A detector scores four windows a second and raises an alarm for any window beyond 3 standard deviations on either side of normal. How many false alarms a day, if normal values are bell-shaped? And with a threshold of 5?',
      steps: ['Windows a day: $4 \\cdot 86\\,400 = 345\\,600$.', 'For $k = 3$: probability $1 - \\mathrm{erf}(3/\\sqrt{2}) = 0.0027$, so $345\\,600 \\cdot 0.0027 \\approx 930$ alarms a day.', 'For $k = 5$: probability $5.7 \\cdot 10^{-7}$, so about $0.2$ a day — one every five days.', 'Requiring three windows in a row multiplies the probability of a false alarm by roughly the square of the single-window figure again, if windows are independent.'],
      a: 'About 930 false alarms a day at 3 sigma, about one every five days at 5 sigma. Persistence helps further.'
    }
  ],
  formulas: [
    {
      name: 'False alarms of a sigma threshold',
      expr: 'F = W*(1 - erf(k/sqrt(2)))',
      tex: 'F = W \\left[ 1 - \\mathrm{erf}\\!\\left(\\frac{k}{\\sqrt{2}}\\right) \\right]',
      vars: {
        F: { name: 'false alarms in the period', q: 'count' },
        W: { name: 'windows scored in the period (4 a second for a day is 345600)', q: 'count', value: 345600, min: 1 },
        k: { name: 'threshold in standard deviations (either side)', q: 'none', value: 3, min: 0.5, max: 6 }
      },
      solveFor: 'F',
      note: 'Assumes bell-shaped (normal) scatter and independent windows. Real data has heavier tails, so real alarm rates are higher: measure them over a long run of normal data.',
      stories: { F: 'A detector scores {W} windows in a period with a threshold of {k} standard deviations on either side. How many false alarms are expected in that period?' }
    }
  ],
  quiz: [
    { q: 'You have six months of recordings of a pump running normally and none of it failing. Which approach fits?', choices: ['A classifier with "fault" as a class', 'An anomaly detector trained on the normal data', 'Neither: you need failures first', 'A bigger microcontroller'], a: 1, why: 'A classifier needs examples of each class. An anomaly detector learns normal only, so it can work with no failure data at all.' },
    { q: 'The detector alarms on the first warm day of summer, after months of quiet. What is the most likely cause?', choices: ['Concept drift: warm running is a normal state it never saw', 'A broken ADC', 'The threshold is too high', 'Wi-Fi interference'], a: 0, why: 'Temperature changes what normal looks like. The model has met only winter behaviour, so warm running is far from it. Train on all seasons, or retrain periodically.' },
    { q: 'Raising the threshold from 3 to 5 standard deviations will...', choices: ['Increase false alarms but find faults sooner', 'Decrease false alarms and make faint faults harder to detect', 'Change nothing', 'Remove the need for training'], a: 1, why: 'A higher threshold needs a stronger deviation before alarming: far fewer false alarms, but small faults stay below it. It is a trade-off between false alarms and missed or late detections.' },
    { q: 'A detector looks only at vibration up to 200 Hz. A bearing fault whines at 4 kHz. What happens?', choices: ['It sees the fault clearly', 'It cannot see it: the fault is outside the sensor\'s bandwidth', 'It sees it at 200 Hz', 'It sees it only at night'], a: 1, why: 'A feature cannot contain information the sensor never captured. The sensor bandwidth and the sampling rate must reach the frequencies where the fault shows up.' }
  ],
  applications: [
    'Predictive maintenance: a pump, fan or motor that starts to sound or vibrate differently.',
    'Spotting a change in a machine after a repair or a wrong part.',
    'Watching a building system, such as a ventilation fan, for blocked filters or loose belts.',
    'Detecting unusual sensor readings in a data logger before sending anything to the cloud.'
  ],
  sources: [
    'Chandola, Banerjee and Kumar, "Anomaly Detection: A Survey" (2009): the families of methods.',
    'Edge Impulse documentation: anomaly detection blocks (clustering of features) for embedded devices.',
    'ISO 20816 (mechanical vibration: evaluation of machine vibration): the standard behind vibration severity measurements.'
  ],
  sim: 'ml-anomaly'
},

/* ================================================================ calling-cloud-ai */
{
  id: 'calling-cloud-ai',
  parent: 'tinyml',
  title: 'Calling a cloud model from an ESP',
  level: 2,
  short: 'When the model is too big for the chip, send it the question. An HTTPS request to a hosted model gives you far more capability for a price in latency, energy, money and privacy — and a token that must never end up in your source code.',
  keywords: ['cloud AI', 'hosted model', 'inference API', 'HTTPS POST', 'bearer token', 'API key', 'latency', 'TLS handshake', 'proxy', 'rate limit', 'privacy', 'offline fallback', 'cascade', 'speech to text', 'image recognition', 'JSON', 'NetworkClientSecure', 'root certificate', 'edge versus cloud'],
  prereq: ['https-and-tls', 'rest-apis-and-json', 'credentials-handling', 'what-fits-in-a-microcontroller'],
  related: ['http-client', 'keyword-spotting', 'image-classification', 'privacy-and-data-protection', 'certificates-and-root-cas', 'nvs-and-preferences', 'battery-life-budget', 'json-on-a-microcontroller'],
  body: `Some questions do not fit on a chip: "what is in this photograph?", "what did the person say, in any words?", "summarise this log". The models that answer them have millions to billions of parameters ([[what-fits-in-a-microcontroller]]). The way out is old and simple: the ESP gathers the data, sends it over the network to a server that runs the model, and acts on the answer. In practice that is an **HTTPS POST** with a small body — features, a JPEG, a second of audio — and a JSON reply.

### What the price is

| Cost | What it looks like on an ESP |
|---|---|
| **Latency** | wake, join Wi-Fi (seconds after deep sleep), TLS handshake, upload, server time, download |
| **Energy** | the radio draws far more than the CPU: the catalogue lists about 340 mA at the transmit peak of an ESP32-S3 |
| **Money and limits** | per-request charges, quotas, rate limits |
| **Privacy** | the data leaves the building and may be stored; audio and images show people |
| **Availability** | no network, no answer: plan an offline fallback |

The simulation adds these up for an on-chip model and a cloud model, with your numbers.

### Sending it safely

- **Verify the server.** Check its certificate against a root you trust, and set the clock first, since validity depends on the date ([[https-and-tls]], [[certificates-and-root-cas]]). Never ship \`setInsecure()\`.
- **Keep the token out of the source.** A key in the program ends up in repositories and in a flash dump of every unit. Keep it in encrypted storage or provision it per device ([[credentials-handling]], [[nvs-and-preferences]]). Better still, send requests to **a small server of your own** that holds the real key: the device carries only a per-device credential that can be revoked and rate-limited, and you can change provider without reflashing.
- **Send less.** Send features, not raw data, when you can: 2 KB of features beat 32 KB of audio on time and energy, and expose less.
- **Time out and back off.** Set a timeout; retry later, with growing gaps; never block the whole program on a request ([[tasks]]).
- **Distrust the answer.** A reply is an input, not a command. Validate it before it switches anything.

### Edge first, cloud second

The best designs combine both: a small model on the chip handles the common, easy cases and decides when to ask the cloud — an on-device wake word, then a server for the sentence ([[keyword-spotting]]). Most of the time, nothing is sent at all.

> [!warn] A request carries your data to another company's servers. Do not send recordings or images of people without their consent, check where the provider stores and uses data, and follow the law that applies where those people are.

> [!key] A cloud model trades latency, energy, money and privacy for capability. Verify the server's certificate, keep the token out of the source (or behind a proxy of your own), send as little as you can, and put a small on-chip model in front so most inputs never leave the device.`,
  ideas: [
    'The ESP gathers the data and sends it with an HTTPS POST; a server runs the large model and returns JSON.',
    'The costs are latency (connect, handshake, upload, server), radio energy, money, privacy and dependence on the network.',
    'Verify the certificate, set the clock first, and keep the token out of the source — or hold the real key on a server of your own.',
    'A small on-chip model that decides when to ask the cloud keeps most traffic, cost and exposure away.'
  ],
  pitfalls: [
    'A token in the sketch is fine for a prototype that stays on my desk — Sketches get shared, committed and compiled into firmware that anyone can dump from flash. Anything with the key in the source is public sooner or later; use a proxy or per-device credentials.',
    'setInsecure() just skips a formality — It turns off the check that you are talking to the right server, so anyone on the path can pose as it and read your data or feed your device false answers. Use the root certificate.',
    'The cloud call is quick, so I can make it inside loop() — A request can take seconds and may hang for much longer. A blocking call freezes buttons, displays and everything else. Put it in its own task with a timeout.'
  ],
  terms: [
    { term: 'Hosted model', also: ['inference API', 'cloud inference'], def: 'A model that runs on a provider\'s servers and is reached by a network request. The device sends input and gets a result back; the model itself never lives on the device.' },
    { term: 'Bearer token', also: ['API key', 'access token'], def: 'A secret string sent in a request header to prove the caller may use a service. Whoever holds it can use the service, so it must be kept out of source code and revoked if exposed.' },
    { term: 'Proxy', also: ['gateway', 'backend for the device'], def: 'A small server you control that sits between the devices and the provider. It holds the real key and applies limits, so a stolen device cannot spend your account.' },
    { term: 'Rate limit', also: ['quota'], def: 'A cap on how many requests a caller may make in a period. A request above it is refused, so a device must handle refusal and wait.' },
    { term: 'Fallback', also: ['graceful degradation', 'offline mode'], def: 'What the device does when the network or the service is unavailable: use a smaller local model, queue the request, or tell the user.' }
  ],
  choose: {
    good: ['Tasks no chip can do: open-ended language, large images, any-word speech', 'Occasional requests, a few an hour, from a device with mains or a good battery', 'A cascade where a local model decides when to ask'],
    avoid: ['Sending recordings or images of people without consent', 'An always-on stream from a battery device', 'Putting a master key in firmware or calling from a time-critical loop'],
    check: ['The time and energy of a whole request after waking from sleep', 'What the device does with no network and with a refused request', 'Where the provider stores your data, for how long and for what']
  },
  code: [
    {
      title: 'Ask a hosted classifier about a feature vector',
      about: 'Connects to Wi-Fi, sets the clock, then POSTs three features as JSON over HTTPS, verified against a root certificate, with a bearer token. It reads back a label and a score. The endpoint is a placeholder: use your own service, and keep the token out of anything you share.',
      needs: 'An ESP32-family board with Wi-Fi, an HTTPS endpoint that accepts {"features":[...]} and answers {"label":"…","score":0.9}, and its root certificate (a PEM in the sketch, a DER file /root_ca.der for MicroPython).',
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          set the clock from the internet :: net

        every (30) seconds
          set header [Authorization] to (join [Bearer ] (token)) :: cloud
          set [answer v] to (http post (join [{"features":[0.12,0.48,1.7]}]) to [https://example.com/api/classify]) :: cloud
          print (join [label ] (label of (answer)) [ score ] (score of (answer)))
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <HTTPClient.h>
        #include <NetworkClientSecure.h>
        #include <ArduinoJson.h>
        #include <time.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const char *URL = "https://example.com/api/classify";    // your own service
        const char *TOKEN = "your-token";                         // never commit a real token

        const char ROOT_CA[] = R"PEM(
        -----BEGIN CERTIFICATE-----
        (paste the root certificate of your server's chain here)
        -----END CERTIFICATE-----
        )PEM";

        bool classify(const float *f, int n, String &label, float &score) {
          NetworkClientSecure client;
          client.setCACert(ROOT_CA);                              // verify the server; needs a correct clock
          HTTPClient http;
          if (!http.begin(client, URL)) return false;
          http.addHeader("Content-Type", "application/json");
          http.addHeader("Authorization", String("Bearer ") + TOKEN);
          http.setTimeout(8000);

          JsonDocument doc;
          JsonArray arr = doc["features"].to<JsonArray>();
          for (int i = 0; i < n; i++) arr.add(f[i]);
          String body;
          serializeJson(doc, body);

          int code = http.POST(body);
          bool ok = false;
          if (code == HTTP_CODE_OK) {
            JsonDocument resp;
            if (!deserializeJson(resp, http.getString())) {
              label = resp["label"] | "unknown";
              score = resp["score"] | 0.0f;
              ok = true;
            }
          } else if (code < 0) {
            Serial.println(http.errorToString(code));
          }
          http.end();
          return ok;
        }

        void setup() {
          Serial.begin(115200);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          configTime(0, 0, "pool.ntp.org");                       // the certificate check needs the date
          struct tm t;
          while (!getLocalTime(&t, 5000)) Serial.println("waiting for the clock");
        }

        void loop() {
          float features[3] = { 0.12f, 0.48f, 1.7f };
          String label;
          float score;
          if (classify(features, 3, label, score)) Serial.printf("label %s, score %.2f\n", label.c_str(), score);
          else Serial.println("request failed: use the local model instead");
          delay(30000);
        }
      `,
      py: String.raw`
        import network, ntptime, time, socket, ssl, json

        SSID, PASS = "your-ssid", "your-password"
        HOST, PATH = "example.com", "/api/classify"               # your own service
        TOKEN = "your-token"                                      # never commit a real token

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect(SSID, PASS)
        while not wlan.isconnected():
            time.sleep_ms(250)
        ntptime.settime()                                         # the certificate check needs the date

        def classify(features):
            body = json.dumps({"features": features})
            ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
            ctx.verify_mode = ssl.CERT_REQUIRED                   # verify the server
            ctx.load_verify_locations(cadata=open("/root_ca.der", "rb").read())
            s = socket.socket()
            s.connect(socket.getaddrinfo(HOST, 443)[0][-1])
            s = ctx.wrap_socket(s, server_hostname=HOST)
            head = "POST %s HTTP/1.0\r\nHost: %s\r\nAuthorization: Bearer %s\r\n" % (PATH, HOST, TOKEN)
            head += "Content-Type: application/json\r\nContent-Length: %d\r\n\r\n" % len(body)
            s.write((head + body).encode())
            reply = b""
            while True:
                chunk = s.read(512)
                if not chunk:
                    break
                reply += chunk
            s.close()
            head_bytes, _, payload = reply.partition(b"\r\n\r\n")
            if b" 200 " not in head_bytes.split(b"\r\n")[0]:
                return None
            return json.loads(payload)

        while True:
            try:
                answer = classify([0.12, 0.48, 1.7])
            except OSError as e:
                answer = None
                print("request failed:", e)
            if answer:
                print("label %s, score %.2f" % (answer["label"], answer["score"]))
            else:
                print("no answer: use the local model instead")
            time.sleep(30)
      `,
      output: `
        label wave, score 0.93
      `,
      notes: ['The MicroPython version uses the ssl module directly because the requests module in the current firmware builds its HTTPS context without verifying the server certificate; the code here does verify it (CERT_REQUIRED). It was written from the module documentation and not run on hardware, so test it against your own server.', 'Core 3.3.12 added useBuiltinCACertBundle(), which checks against a built-in set of public roots; with an older core, give setCACert the root of your own server\'s chain. Certificates expire, so use the root and keep the clock right.', 'For a real product do not store the token in the source: put it in encrypted storage ([[nvs-encryption]]) or, better, give each device its own credential and keep the real key on your server.']
    }
  ],
  examples: [
    {
      title: 'Edge or cloud for one second of audio?',
      q: 'One second of 16 kHz, 16-bit audio is sent to a cloud service over Wi-Fi at an effective 2 Mbit/s. Connecting and the TLS handshake take 1.5 s, the server answers in 0.4 s. A local model on the chip would take 0.05 s. What is the cloud latency, and what does it say about the choice?',
      steps: ['Audio size: $16\\,000 \\cdot 2 = 32\\,000$ bytes = 256 kbit.', 'Upload: $256 / 2000 = 0.13$ s.', 'Total: $1.5 + 0.13 + 0.4 \\approx 2.0$ s, against 0.05 s on the chip — forty times longer.', 'Sending only 2 KB of features would cut the upload to 0.008 s but not the connection time: if you ask often, keep the connection open or batch requests.'],
      a: 'About 2 s against 0.05 s. The connection set-up dominates, so use the cloud only for what the chip cannot do, and ask rarely.'
    }
  ],
  formulas: [
    {
      name: 'Time to send a request',
      expr: 't = 8*B/(R*1000000)',
      tex: 't_{\\mathrm{up}} = \\frac{8\\, B}{R}',
      vars: {
        t: { name: 'time to upload the body', q: 'time', unit: 's' },
        B: { name: 'size of the body', q: 'none', value: 32000, min: 1, tex: 'B' },
        R: { name: 'effective upload rate (not the nominal link rate)', q: 'none', value: 2, min: 0.001, tex: 'R' }
      },
      solveFor: 't',
      note: 'B is in bytes and R in Mbit/s. The effective rate over Wi-Fi to a distant server is far lower than the link speed: measure it. Connection set-up and the TLS handshake are extra and often larger.',
      stories: { t: 'A body of {B} bytes is uploaded at an effective {R} Mbit/s. How long does the upload take?' }
    }
  ],
  quiz: [
    { q: 'Where should the real API key of a cloud service live in a product with a thousand ESP devices?', choices: ['In the sketch, as a constant', 'On a server of yours: the devices hold only revocable per-device credentials', 'In the README', 'Printed on the case'], a: 1, why: 'A key in firmware can be read out of any one device and used by anyone. A proxy that holds the real key, with a revocable credential and a rate limit per device, limits the damage of one stolen unit.' },
    { q: 'Why does the program set the clock before the HTTPS request?', choices: ['The server wants the time of day', 'Certificate validity is checked against the date, so a wrong clock makes the check fail', 'To save power', 'The model uses it'], a: 1, why: 'A certificate is valid between two dates. A device that thinks it is 1970 sees every certificate as not yet valid and refuses the connection.' },
    { q: 'A battery sensor sends 2 KB of features once a minute, and wakes from deep sleep each time. Where does most of the time and energy go?', choices: ['Moving the 2 KB', 'Joining Wi-Fi and the TLS handshake', 'The server', 'The microphone'], a: 1, why: 'Two kilobytes take milliseconds to send. Associating with the access point and negotiating TLS take seconds at a high current, so they dominate; batch several readings or keep the connection open.' },
    { q: 'The cloud answer says "turn the heater on". What should the program do?', choices: ['Do it at once: the cloud is smart', 'Validate it against its own rules and limits first; it is an input, not a command', 'Ignore all answers', 'Send the answer back to the cloud'], a: 1, why: 'A reply can be wrong, delayed or tampered with. Check it against limits the device itself enforces (a maximum temperature, a minimum interval) before it drives anything.' }
  ],
  applications: [
    'A camera board that asks a hosted vision model what is in a photograph, only when a motion detector fires.',
    'A voice device that detects its wake word locally and sends the following sentence to a speech service.',
    'A data logger that sends a day of readings for a larger model to analyse.',
    'A device that asks a language model to turn a status into a sentence for a display.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*: HTTP client, ESP-TLS and the certificate bundle.',
    'Arduino core for ESP32 documentation: HTTPClient and NetworkClientSecure.',
    'ArduinoJson documentation, version 7: JsonDocument, serializeJson and deserializeJson.'
  ],
  sim: 'ml-cloud'
},

/* ================================================================ ai-accelerators-s3-and-p4 */
{
  id: 'ai-accelerators-s3-and-p4',
  parent: 'tinyml',
  title: 'What the S3 and P4 add',
  level: 3,
  short: 'Two Espressif chips carry vector instructions that do many small multiplications in one step. They make quantised models run several times faster than on a plain core — and the P4 adds hardware for the pictures that feed them.',
  keywords: ['ESP32-S3', 'ESP32-P4', 'SIMD', 'vector instructions', 'PIE', 'AI instructions', 'PPA', 'pixel-processing accelerator', 'JPEG codec', 'H.264', 'ESP-NN', 'ESP-DL', 'int8', 'MACs per cycle', 'PSRAM', 'ESP32-S31', 'inference speed'],
  prereq: ['what-fits-in-a-microcontroller', 'quantization', 'tflite-micro-and-esp-dl'],
  related: ['soc-esp32-s3', 'soc-esp32-p4', 'the-newest-chips', 'image-classification', 'face-detection', 'using-psram', 'esp-as-a-co-processor', 'choosing-a-chip', 'cpu-cores-and-clocks'],
  body: `A plain CPU core multiplies one pair of numbers per instruction. A neural network needs millions of such multiplications, so the time per inference is set by how many the chip completes per second. The ESP32-S3 and the ESP32-P4 add **vector instructions** (SIMD, single instruction, multiple data): the registers are 128 bits wide, so one instruction can handle sixteen 8-bit values at once, which is exactly the shape of a quantised model ([[quantization]]). The catalogue lists the same 128-bit SIMD for the newer ESP32-S31, still in preview software.

### What each chip offers

| | ESP32-S3 | ESP32-P4 |
|---|---|---|
| Cores | two Xtensa LX7, 240 MHz | two RISC-V, 400 MHz (plus a 40 MHz low-power core) |
| Vector instructions | 128-bit SIMD | 128-bit SIMD (the catalogue calls it PIE) |
| Internal SRAM | 512 KB | 768 KB |
| PSRAM | up to 32 MB mapped at a time | 16 or 32 MB in the package |
| Extras for pictures | camera and LCD interfaces | MIPI camera and display, pixel-processing accelerator, JPEG codec, H.264 encoder |
| Radio | Wi-Fi 4 and Bluetooth LE | none: needs a companion radio chip |

The chips without vector instructions — the ESP32, the C series, the H series — run the same models with ordinary code. They are slower, but a gesture or anomaly model of a few thousand multiplications needs no accelerator at all.

### How much faster?

It depends on the layer, the data type and the library: optimised kernels (ESP-NN under TensorFlow Lite Micro, and Espressif's own library, [[tflite-micro-and-esp-dl]]) use the vector instructions, plain C does not. Expect several times for convolutions with 8-bit data; do not expect it for operations that are memory-bound or that the library has no optimised kernel for. Where the weights live matters as much: weights and activations in internal RAM feed the vector unit; PSRAM is slower and a big model that sits in it can lose much of the gain ([[using-psram]]). Measure the **MACs per cycle** you really get — the program below does — and put it in the time formula.

### What the P4 adds around the network

A camera gives pixels, and a network wants a small, correctly sized image. The P4's **pixel-processing accelerator** can scale, rotate and blend images in hardware, and its **JPEG codec** can decode frames from a JPEG camera, so the cores spend their time on the network and not on resizing ([[image-classification]], [[face-detection]]). It has no radio: results travel through a companion chip ([[esp-as-a-co-processor]]), and its active current is far higher than a C-series chip's (the catalogue gives 97 mA with both cores at 400 MHz).

### Choosing

Speed is also energy: a task that finishes four times sooner keeps the chip awake a quarter as long. But the fastest chip is rarely the right chip: use an S3 or P4 for images and large models, an ordinary chip for small ones ([[choosing-a-chip]]).

> [!key] The S3 and the P4 have 128-bit vector instructions that process sixteen int8 values at once, which makes quantised models several times faster when the library has optimised kernels and the data sits in internal RAM. The P4 adds image hardware, no radio and a high current; small models do not need either chip.`,
  ideas: [
    'Vector (SIMD) instructions do many small multiplications at once: sixteen int8 values per 128-bit instruction.',
    'The speed-up depends on the library having optimised kernels, on 8-bit data and on weights sitting in fast internal RAM.',
    'The P4 adds a pixel-processing accelerator and a JPEG codec to prepare images, but has no radio and a high active current.',
    'Small models (gestures, anomaly detection, short keyword spotting) do not need an accelerator; images and large models do.'
  ],
  pitfalls: [
    'An S3 is sixteen times faster than a C3 for neural networks — Sixteen is the number of int8 lanes, not the speed-up. Loads, stores, layer types and PSRAM bring the real gain down to a few times, and it only appears with optimised kernels.',
    'Any model gets faster on the vector unit — Only operations with optimised kernels use it, and mostly in 8-bit form. A float model, or a layer type the library does not accelerate, runs at ordinary speed.',
    'The P4 is just a faster S3 — It has no Wi-Fi or Bluetooth, no flash in the package and a much higher current. It is a vision and display chip that needs a radio companion for networking.'
  ],
  terms: [
    { term: 'SIMD', also: ['vector instructions', 'single instruction multiple data'], def: 'An instruction that applies the same operation to several values packed in one wide register — here sixteen 8-bit values in 128 bits. It is the reason neural-network kernels run faster on the S3 and P4.' },
    { term: 'PIE', also: ['processor instruction extensions'], def: 'The name Espressif gives the AI and DSP instruction extensions in the catalogue entry for the ESP32-P4. They are the vector instructions of that chip.' },
    { term: 'PPA', also: ['pixel-processing accelerator'], def: 'A hardware block of the ESP32-P4 that scales, rotates, mirrors and blends images, so that the cores do not have to.' },
    { term: 'JPEG codec', also: ['hardware JPEG'], def: 'A hardware encoder and decoder for JPEG pictures. On the ESP32-P4 it decodes camera frames without using the cores.' },
    { term: 'Effective MACs per cycle', also: ['MAC rate'], def: 'How many multiply-accumulates a chip really completes per clock cycle with a given model and library. It is measured, not read from a datasheet.' }
  ],
  choose: {
    good: ['ESP32-S3 for image and audio models with Wi-Fi and Bluetooth LE on one chip', 'ESP32-P4 for cameras, displays and heavier vision, with a companion radio chip', 'C-series and others for small models: gestures, anomaly detection, short keyword models'],
    avoid: ['A P4 where a radio and a battery are essential, without planning for its current', 'Putting a large model in PSRAM and expecting full vector-unit speed', 'Choosing the chip from the lane count instead of a measured time'],
    check: ['Inference time of your model on each candidate chip, with its optimised kernels', 'Where the weights and the arena sit: internal RAM or PSRAM', 'Software support: the P4 and the S31 are newer than the S3']
  },
  code: [
    {
      title: 'Measure the MACs per cycle of your chip',
      about: 'Multiplies two vectors of 1000 int8 numbers a hundred times, times it and prints how many multiply-accumulates per cycle the plain code achieved. That figure is the baseline for the time formula; optimised kernels on an S3 or P4 do better, a MicroPython loop much worse.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [macs v] to ((1000) * (100))
          set [t0 v] to (microseconds since start)
          repeat (100)
            set [s v] to (dot product of (a) and (b)) :: ai
          end
          set [us v] to ((microseconds since start) - (t0))
          print (join (macs) [ MACs in ] (us) [ us: ] ((macs) / ((us) * (CPU MHz))) [ per cycle])
      `,
      cpp: String.raw`
        const int LEN = 1000;
        const int REPEAT = 100;                      // 100 x 1000 = 100,000 MACs
        int8_t a[LEN], b[LEN];

        void setup() {
          Serial.begin(115200);
          delay(1000);
          for (int i = 0; i < LEN; i++) { a[i] = (i * 7) % 100 - 50; b[i] = (i * 3) % 100 - 50; }
          volatile int32_t acc = 0;                  // volatile: the compiler may not skip the work
          uint32_t t0 = micros();
          for (int r = 0; r < REPEAT; r++) {
            int32_t s = 0;
            for (int i = 0; i < LEN; i++) s += a[i] * b[i];
            acc += s;
          }
          uint32_t us = micros() - t0;
          float macs = (float)LEN * REPEAT;
          float perCycle = macs / ((float)us * getCpuFrequencyMhz());    // MHz is cycles per microsecond
          Serial.printf("%.0f MACs in %u us: %.2f MAC/us, %.3f MACs per cycle at %u MHz\n",
                        macs, (unsigned)us, macs / us, perCycle, (unsigned)getCpuFrequencyMhz());
        }

        void loop() {}
      `,
      py: String.raw`
        import time, machine
        from array import array

        LEN = 1000
        REPEAT = 100                                 # 100 x 1000 = 100,000 MACs
        a = array("b", [(i * 7) % 100 - 50 for i in range(LEN)])
        b = array("b", [(i * 3) % 100 - 50 for i in range(LEN)])

        acc = 0
        t0 = time.ticks_us()
        for r in range(REPEAT):
            s = 0
            for i in range(LEN):
                s += a[i] * b[i]
            acc += s
        us = time.ticks_diff(time.ticks_us(), t0)
        macs = LEN * REPEAT
        mhz = machine.freq() // 1000000              # MHz is cycles per microsecond
        print("%d MACs in %d us: %.3f MAC/us, %.4f MACs per cycle at %d MHz" % (macs, us, macs / us, macs / (us * mhz), mhz))
      `,
      output: `
        100000 MACs in 1480 us: 67.57 MAC/us, 0.282 MACs per cycle at 240 MHz
      `,
      notes: ['The output line is an example, not a measurement of your chip: plain compiled code on a 240 MHz core typically completes a fraction of a MAC per cycle, and the MicroPython version is hundreds of times slower.', 'This measures ordinary scalar C. It does not use the vector instructions of the S3 or P4; to see them, time a real model with and without the optimised kernels of the library ([[tflite-micro-and-esp-dl]]).', 'Put the figure you measure into the time formula to estimate other models on the same chip, and measure again with the weights in PSRAM to see what the slower memory costs.']
    }
  ],
  examples: [
    {
      title: 'Time and energy of one image inference',
      q: 'A small image classifier needs 12 million MACs. On a plain core at 240 MHz it achieves 0.3 MACs per cycle; with optimised vector kernels on the same clock, assume 1.5. The chip draws 60 mA at 3.3 V while computing. How long and how much energy does one inference take in each case?',
      steps: ['Plain: $t = 12\\cdot 10^6 / (240\\cdot 10^6 \\cdot 0.3) = 0.167$ s. Energy: $3.3 \\cdot 0.060 \\cdot 0.167 = 33$ mJ.', 'Vector: $t = 12\\cdot 10^6 / (240\\cdot 10^6 \\cdot 1.5) = 0.033$ s. Energy: $3.3 \\cdot 0.060 \\cdot 0.033 = 6.6$ mJ.', 'Five times faster is five times less energy, if the current is the same: speed is battery life.'],
      a: 'About 167 ms and 33 mJ on the plain core; about 33 ms and 6.6 mJ with vector kernels (the rates here are assumptions: measure yours).'
    }
  ],
  formulas: [
    {
      name: 'Energy of one inference',
      expr: 'E = V*I*t',
      tex: 'E = V\\, I\\, t',
      vars: {
        E: { name: 'energy of one inference', q: 'energy', unit: 'mJ' },
        V: { name: 'supply voltage', q: 'voltage', unit: 'V', value: 3.3, min: 0.5 },
        I: { name: 'current while computing', q: 'current', unit: 'mA', value: 60, min: 0 },
        t: { name: 'time of one inference', q: 'time', unit: 'ms', value: 33, min: 0 }
      },
      solveFor: 'E',
      note: 'Use the current of the whole board while the model runs, measured. A faster chip often uses a higher current but for a much shorter time.',
      stories: { E: 'A board draws {I} at {V} while running a model that takes {t}. How much energy does one inference use?' }
    }
  ],
  quiz: [
    { q: 'A 128-bit vector register holds how many int8 values?', choices: ['4', '8', '16', '128'], a: 2, why: '128 bits divided by 8 bits is 16 values. That is the best-case number of multiplications per instruction; the real gain is lower because of loads, stores and layers that do not vectorise.' },
    { q: 'Which statement about the ESP32-P4 is true?', choices: ['It has Wi-Fi 6 built in', 'It has no radio and needs a companion chip for wireless', 'It has no vector instructions', 'It runs only MicroPython'], a: 1, why: 'The P4 is a fast dual-core RISC-V chip with vector instructions, camera and display hardware — and no Wi-Fi or Bluetooth. Boards pair it with a radio chip such as an ESP32-C6.' },
    { q: 'A float32 model is run on an ESP32-S3 with ESP-NN. How much of the vector speed-up should you expect?', choices: ['All of it', 'Little: the optimised kernels are for 8-bit integer data, so quantise the model', 'None, the S3 has no vector unit', 'More than for int8'], a: 1, why: 'The vector kernels are written for quantised integer operations. A float model runs on the ordinary floating-point unit; quantising it first is what unlocks the S3\'s advantage.' },
    { q: 'You need a gesture classifier of 8,000 MACs once a second on a coin cell. Which chip is the sensible choice?', choices: ['An ESP32-P4', 'An ESP32-S3, for its vector unit', 'An ordinary low-power chip such as an ESP32-C3 or C6', 'Any of them: speed is the only factor'], a: 2, why: '8,000 MACs take a millisecond or less even on a plain core. The vector unit would save microseconds while the chip costs more current and complexity; a small, low-power chip is the better fit.' }
  ],
  applications: [
    'Person detection and simple object classification on an ESP32-S3 camera board.',
    'Face detection and recognition at a usable frame rate on an S3 or P4.',
    'Wake-word detection and command recognition with a larger model on an S3 board with PSRAM.',
    'Vision on an ESP32-P4 board with a display, where the P4 also draws the interface.'
  ],
  sources: [
    'Espressif, ESP32-S3 Technical Reference Manual and datasheet: the vector instructions and the memory.',
    'Espressif, ESP32-P4 datasheet: the instruction extensions, the pixel-processing accelerator and the JPEG codec.',
    'Espressif, the esp-nn and ESP-DL documentation: which chips and data types the optimised kernels support.'
  ],
  sim: { id: 'ml-fit', params: { mode: 'speed' } }
}
);
