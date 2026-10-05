/* HYPER-ESP32 · content/audio.js
 *
 * Topic "Audio" (code au): samples and bits, I2S and PDM microphones, amplifiers and DACs, codecs, playing files,
 * internet radio, Bluetooth audio, the FFT, wake words, voice assistants.
 */
Hyper.add(
/* ================================================================ digital-audio-basics */
{
  id: 'digital-audio-basics',
  parent: 'audio',
  title: 'Digital audio: samples and bits',
  level: 1,
  short: 'Sound is moving air; a microcontroller keeps a list of numbers. How often the list is made (the sample rate) and how finely each number is measured (the bit depth) set the highest pitch and the quietest detail it can hold.',
  keywords: ['sample rate', 'bit depth', 'Nyquist', 'aliasing', 'PCM', 'dBFS', 'quantisation', 'quantization noise', '16 kHz', '44.1 kHz', 'mono', 'stereo', 'WAV', 'dynamic range', 'audio', 'sampling'],
  prereq: ['the-esp-adc', 'bits-and-bytes', 'electronics:sampling-nyquist'],
  related: ['i2s', 'i2s-microphones', 'i2s-amplifiers-and-dacs', 'fft-and-spectrum', 'dac-output', 'playing-audio-files', 'electronics:adc'],
  body: `A loudspeaker moves air; a microphone turns moving air into a voltage that wobbles up and down. A microcontroller cannot store a wobbling voltage. It can store **numbers**, so it measures the voltage again and again at a steady rate and keeps the list. Played back at the same rate through a converter, the list becomes a voltage again, and the voltage moves a speaker. Everything in this topic is about making, moving or using that list.

### Two numbers describe a stream

- **Sample rate**: how many measurements per second, for each channel. Telephones use 8 000, speech recognition and most ESP projects 16 000, CDs 44 100, video and studios 48 000.
- **Bit depth**: how many bits each measurement has. 8 bits give 256 levels, 16 bits 65 536, 24 bits about 16.8 million.

The number of **channels** (1 mono, 2 stereo) multiplies both. The data rate of a stream is sample rate × bits × channels: 16 kHz mono at 16 bits is 256 kbit/s, or 32 kB/s; CD audio (44.1 kHz, stereo, 16 bits) is 1 411 kbit/s, or 176 kB/s. Ten seconds of the first is 320 000 bytes, which is why audio buffers live in [[using-psram|PSRAM]] or are streamed instead of stored.

### What the sample rate limits: pitch

A stream sampled at $f_s$ can hold only frequencies below half of it, the **Nyquist frequency** $f_s/2$. A 16 kHz stream holds sound up to 8 kHz: plenty for speech, too little for cymbals. A tone above the limit is not simply lost, it is **aliased**: it comes back as a false lower tone at $|f - k f_s|$ for the nearest whole number $k$, and nothing afterwards can tell it from a real one. That is why converters have a filter in front that removes what lies above the limit. The first simulation below shows it.

### What the bit depth limits: detail

Each sample is rounded to the nearest level, and the rounding error is **quantisation noise**. Every extra bit halves the step and lowers that noise by about 6 dB, so the span between the loudest sound and the noise floor is about $6.02N + 1.76$ dB for $N$ bits: 50 dB for 8 bits (hissy), 98 dB for 16 bits (good listening), 146 dB for 24 bits (more than any microphone delivers). In signed 16-bit audio 0 is silence and ±32 767 the loudest; levels are quoted in **dBFS**, decibels below full scale: 0 dBFS is the maximum, −6 dBFS half of it. Go past it and the wave **clips**.

### Formats you will meet

Raw **PCM** is the list itself, stored low byte first on the ESP. A **WAV** file is PCM behind a 44-byte header that states the rate, the bits and the channels. Unsigned 8-bit audio rests at 128, signed 16-bit at 0: mixing the two gives loud buzzing. MP3 and similar formats trade processing for size ([[playing-audio-files]]).

> [!key] Digital audio is a list of numbers at a steady rate. The sample rate sets the highest frequency (half of it) and the bit depth sets the quietest detail (about 6 dB per bit). Use the lowest of both that does the job — 16 kHz and 16 bits for speech — because every sample must be stored, moved and processed.`,
  ideas: [
    'A digital sound is a list of numbers measured at a steady rate; the rate and the bits per number describe it.',
    'The highest frequency a stream can hold is half its sample rate, the Nyquist frequency; a higher tone folds back as a false lower one.',
    'Each bit of depth adds about 6 dB of dynamic range: 8 bits about 50 dB, 16 bits about 98 dB.',
    'Data rate is sample rate × bits × channels; 16 kHz, 16-bit mono is 32 kB/s, enough to fill an ESP\'s RAM in seconds.'
  ],
  pitfalls: [
    'A 16 kHz sample rate means sound up to 16 kHz — Half of it: 8 kHz. The Nyquist limit is fs/2, and a real converter\'s filter rolls off a little before that.',
    'More bits means more treble — Bits set the quiet detail and the noise floor; the sample rate sets the treble. A 24-bit stream at 8 kHz still has nothing above 4 kHz.',
    'Aliasing can be fixed in software afterwards — Once a tone has folded it is identical to a real low tone. It must be removed before sampling, by a filter in the analogue path or by oversampling in the converter.'
  ],
  terms: [
    { term: 'Sample rate', also: ['sampling frequency', 'fs'], def: 'How many measurements of the signal are made each second, for each channel: 8 kHz for telephones, 16 kHz for speech recognition, 44.1 or 48 kHz for music.' },
    { term: 'Nyquist frequency', also: ['Nyquist limit', 'fs/2'], def: 'Half the sample rate, the highest frequency a sampled signal can represent. Anything above it is folded back as a false lower frequency.' },
    { term: 'Aliasing', also: ['folding', 'alias'], def: 'The error in which a frequency above the Nyquist limit appears as a lower one after sampling. It cannot be removed afterwards; a filter before the converter prevents it.' },
    { term: 'Bit depth', also: ['resolution', 'word length', 'bits per sample'], def: 'The number of bits in each sample. It sets how many levels are available and so the quantisation noise: about 6 dB of dynamic range per bit.' },
    { term: 'PCM', also: ['pulse-code modulation', 'raw audio'], def: 'The plain form of digital audio: a stream of sample values, one after another, with no compression. WAV files and I2S streams carry PCM.' },
    { term: 'dBFS', also: ['decibels full scale'], def: 'A level measured against the largest value a digital stream can hold: 0 dBFS is full scale, −6 dBFS about half of it. Values above 0 dBFS cannot exist and clip.' }
  ],
  code: [
    {
      title: 'One cycle of a sine, sampled and rounded',
      about: 'Prints one cycle of a 1 kHz tone sampled at 16 kHz (16 samples), then the same samples rounded to a few bits, and the error each rounding makes. No extra hardware: run it on any board and change `BITS` to 3, 8 or 12 to see the error shrink.',
      needs: 'Any ESP board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [levels v] to (2 to the power of (4))      // BITS = 4: 16 levels
          set [half v] to ((levels) / (2))
          for each [n v] in (0 to 15)
            set [x v] to (sine of ((2 * 3.14159 * 1000 * (n)) / (16000)))
            set [code v] to (round ((x) * (half)))
            set [code v] to (limit (code) between ((0) - (half)) and ((half) - (1)))
            print (join (n) [  ] (x) [  ] ((code) / (half)) [  error ] (((code) / (half)) - (x)))
          end
      `,
      cpp: String.raw`
        const int RATE = 16000;           // samples per second
        const int FREQ = 1000;            // the tone, in Hz
        const int BITS = 4;               // try 3, 8 or 12

        void setup() {
          Serial.begin(115200);
          delay(1000);
          const int levels = 1 << BITS;   // 16 levels for 4 bits
          const int half = levels / 2;    // a signed code runs from -half to half - 1
          Serial.printf("1 cycle of %d Hz at %d Hz: %d samples, %d levels\n", FREQ, RATE, RATE / FREQ, levels);
          for (int n = 0; n < RATE / FREQ; n++) {
            float x = sin(2 * PI * FREQ * n / RATE);       // the true value, -1 to +1
            int code = round(x * half);                    // rounded to the nearest level
            code = constrain(code, -half, half - 1);       // the top level does not exist
            float q = (float)code / half;
            Serial.printf("%2d  %+.3f  %+.3f  error %+.3f\n", n, x, q, q - x);
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import math

        RATE = 16000                      # samples per second
        FREQ = 1000                       # the tone, in Hz
        BITS = 4                          # try 3, 8 or 12

        levels = 1 << BITS                # 16 levels for 4 bits
        half = levels // 2                # a signed code runs from -half to half - 1
        print("1 cycle of", FREQ, "Hz at", RATE, "Hz:", RATE // FREQ, "samples,", levels, "levels")
        for n in range(RATE // FREQ):
            x = math.sin(2 * math.pi * FREQ * n / RATE)    # the true value, -1 to +1
            code = round(x * half)                         # rounded to the nearest level
            code = max(-half, min(half - 1, code))         # the top level does not exist
            q = code / half
            print("%2d  %+.3f  %+.3f  error %+.3f" % (n, x, q, q - x))
      `,
      output: `
        1 cycle of 1000 Hz at 16000 Hz: 16 samples, 16 levels
         0  +0.000  +0.000  error +0.000
         1  +0.383  +0.375  error -0.008
         2  +0.707  +0.750  error +0.043
         3  +0.924  +0.875  error -0.049
         4  +1.000  +0.875  error -0.125
         5  +0.924  +0.875  error -0.049
         ...
      `,
      notes: ['The largest error, 0.125 at the top of the wave, is the clipped peak: a signed code cannot reach +1.0. The ordinary rounding error is never more than half a step (0.0625 here).', 'Set BITS to 8 and the errors drop to a few thousandths; at 16 they vanish into the third decimal place.']
    }
  ],
  formulas: [
    {
      name: 'The highest frequency a stream can hold',
      expr: 'fmax = fs/2',
      tex: 'f_{max} = \\frac{f_s}{2}',
      vars: {
        fmax: { name: 'Nyquist frequency', tex: 'f_{max}', q: 'frequency', unit: 'kHz' },
        fs: { name: 'sample rate', tex: 'f_s', q: 'frequency', unit: 'kHz', value: 16 }
      },
      solveFor: 'fmax',
      note: 'A real converter filters a little below this limit. Anything above it must be removed before sampling, or it is folded back as a false lower tone.',
      stories: { fmax: 'A microphone is sampled at {fs}. What is the highest frequency the stream can represent?', fs: 'A stream must carry sound up to {fmax}. What is the lowest sample rate that can hold it (before any margin for the filter)?' },
      practice: { unknowns: ['fmax', 'fs'] }
    },
    {
      name: 'Dynamic range of N bits',
      expr: 'DR = 6.02*Nb + 1.76',
      tex: '\\mathrm{DR} = 6.02\\,N_b + 1.76',
      vars: {
        DR: { name: 'dynamic range (a full-scale sine against the quantisation noise)', tex: '\\mathrm{DR}', q: 'gain', unit: 'dB' },
        Nb: { name: 'bits per sample', tex: 'N_b', value: 16, min: 1, max: 32, int: true }
      },
      solveFor: 'DR',
      note: 'The ideal figure for a perfect converter and a full-scale sine. Real parts do worse: a microphone or an amplifier\'s own noise usually limits a recording long before the bit depth does.',
      stories: { DR: 'A recording is stored with {Nb} bits per sample. What is the ideal dynamic range?', Nb: 'A recording must reach {DR} between the loudest peak and the quantisation floor. How many bits are needed?' },
      practice: { unknowns: ['DR', 'Nb'] }
    },
    {
      name: 'The data rate of a stream',
      expr: 'R = fs*b*n',
      tex: 'R = f_s \\, b \\, n',
      vars: {
        R: { name: 'data rate', q: 'datarate', unit: 'kbit/s' },
        fs: { name: 'sample rate', tex: 'f_s', q: 'frequency', unit: 'kHz', value: 16 },
        b: { name: 'bits per sample', value: 16, min: 1, max: 32, int: true },
        n: { name: 'channels', value: 1, min: 1, max: 8, int: true }
      },
      solveFor: 'R',
      note: 'The raw PCM rate. Divide by 8 for bytes per second. On an I2S bus a 24-bit sample travels in a 32-bit slot, so the bus clock follows the slot, not the sample.',
      stories: { R: 'A stream has {n} channel(s) at {fs} with {b} bits each. What data rate does it need?', fs: 'A link carries {R} of {n}-channel, {b}-bit audio. What is the sample rate?' },
      practice: { unknowns: ['R', 'fs'] }
    }
  ],
  examples: [
    {
      title: 'Will a ten-second voice note fit in RAM?',
      q: 'A voice recorder keeps 10 seconds of speech at 16 kHz, 16 bits, mono, in RAM. How many bytes is that? How many at 8 kHz and 8 bits?',
      steps: ['Bytes per second at 16 kHz, 16 bits, one channel: $16\\,000 \\times 2 = 32\\,000$.', 'For 10 s: 320 000 bytes, about 312 KiB. An ESP32-C3 has 400 KB of RAM in all, and the radio stack and the program need much of that.', 'At 8 kHz and 8 bits the rate is 8 000 bytes per second: 80 000 bytes for 10 s. It fits, but 8 bits give only about 50 dB of range and 8 kHz holds sound only up to 4 kHz: a poor, telephone-like recording.'],
      a: '320 000 bytes at 16 kHz and 16 bits; 80 000 bytes at 8 kHz and 8 bits. For long recordings use PSRAM, an SD card, or stream the audio away as it is made.'
    },
    {
      title: 'A tone that comes back wrong',
      q: 'A 6 kHz tone is sampled at 8 kHz. What frequency does the sampled stream contain?',
      steps: ['The Nyquist limit is $8 / 2 = 4$ kHz, so 6 kHz is above it and will fold.', 'The alias is $|6 - 8| = 2$ kHz (k = 1 is the nearest multiple of the sample rate).', 'The stream now holds a clean 2 kHz tone that is indistinguishable from a real one.'],
      a: '2 kHz. A tone at 6 kHz and one at 2 kHz give identical samples at 8 kHz.'
    }
  ],
  quiz: [
    { q: 'A microphone is sampled at 16 kHz. What is the highest frequency the stream can represent?', choices: ['4 kHz', '8 kHz', '16 kHz', '32 kHz'], a: 1, why: 'The Nyquist limit is half the sample rate. A real filter has to start rolling off a little below 8 kHz, but 8 kHz is the theoretical top.' },
    { q: 'A 6 kHz tone is sampled at 8 kHz without a filter in front. What is heard on playback?', choices: ['A 6 kHz tone', 'A 2 kHz tone', 'A 14 kHz tone', 'Silence'], a: 1, why: 'The tone is above the 4 kHz limit and folds to |6 − 8| = 2 kHz. The samples of the two tones are identical.' },
    { q: 'Changing the stream from 8 to 16 bits per sample raises the highest frequency it can carry.', a: false, why: 'Bit depth sets the noise floor and the dynamic range (about 6 dB per bit). The highest frequency is set only by the sample rate.' },
    { q: 'How many bytes does 10 seconds of 16 kHz, 16-bit, mono audio occupy?', choices: ['32 000', '160 000', '320 000', '3 200 000'], a: 2, why: '16 000 samples a second × 2 bytes × 10 s = 320 000 bytes.' }
  ],
  applications: [
    'Choosing the format of a voice recorder: 16 kHz and 16 bits is the usual choice for speech, and what speech-recognition services expect.',
    'Deciding how much memory an audio buffer needs, or whether a recording can stay in RAM.',
    'Understanding why a signal with ultrasound or switching noise sounds wrong after sampling, and why a filter belongs before the converter.',
    'Reading the settings of every audio library and I2S call in the rest of this topic.'
  ],
  sources: [
    'Claude E. Shannon, "Communication in the presence of noise", 1949, the sampling theorem.',
    'Espressif, *ESP-IDF Programming Guide*, I2S API reference: data and slot widths, sample rates.',
    'Arduino core for ESP32 documentation, *I2S* (ESP_I2S) API (core 3.3).'
  ],
  sim: ['au-sampling', 'au-quantise']
},

/* ================================================================ i2s-microphones */
{
  id: 'i2s-microphones',
  parent: 'audio',
  title: 'I2S and PDM microphones',
  level: 2,
  short: 'Digital microphones put the converter inside the capsule and send samples over three wires (I2S) or a one-bit stream (PDM). How to wire and read them, why their numbers look tiny, and the one-pin mistake that makes a working microphone read zero.',
  keywords: ['microphone', 'INMP441', 'ICS-43434', 'SPH0645', 'MSM261S4030H0', 'SPM1423', 'MP34DT01', 'MEMS', 'I2S', 'PDM', 'L/R select', 'dBFS', 'sensitivity', 'dB SPL', 'sound level meter', 'MAX9814', 'MAX4466', 'electret', 'DC offset'],
  prereq: ['digital-audio-basics', 'i2s', 'bits-and-bytes'],
  related: ['i2s-amplifiers-and-dacs', 'audio-codecs', 'wake-words-and-speech-commands', 'fft-and-spectrum', 'the-esp-adc', 'cameras-and-the-law', 'xiao-esp32s3-and-sense'],
  body: `A microphone is the first thing a voice project needs, and the first place it goes wrong. Three kinds are in use.

### Three kinds of microphone

| Kind | Output | Typical parts | On an ESP |
|---|---|---|---|
| Analogue (electret or MEMS plus amplifier) | a voltage around mid-supply | MAX4466, MAX9814, electret capsules | the ADC: noisy and non-linear, fine for a clap switch, poor for speech |
| I2S MEMS | digital samples, 24 bits in a 32-bit slot | INMP441, ICS-43434, SPH0645 | the I2S block reads them straight into memory |
| PDM MEMS | a one-bit stream at 1 to 3 MHz | SPM1423, MP34DT01 | the I2S block of the ESP32 and ESP32-S3 turns it into samples |

Digital microphones carry the converter *inside* the capsule, so no faint analogue wire crosses a board full of Wi-Fi noise: nearly every voice board uses them.

### Reading an I2S microphone

It needs 3.3 V, the three I2S wires and a select pin, **L/R**, that chooses which half of each frame it speaks in: tied to ground it answers in the left slot, tied to the supply in the right slot. In the other slot its data pin goes high-impedance, so two microphones can share one data wire as a stereo pair. The ESP is the master and makes BCLK and WS; the microphone only listens and answers. The 24-bit sample comes most significant bit first, at the front of a 32-bit slot, so read **32-bit samples** and shift right by 8 for the signed 24-bit value.

The commonest failure: L/R is on the supply, the program reads the left slot, and every sample is zero, with no error. Try it in the first simulation.

### PDM microphones

A PDM microphone sends one bit per clock, at a clock far above the sampling rate (64 times is common). The *density* of ones is the sound: a loud positive peak is nearly all ones, a negative peak nearly all zeros, silence a steady alternation. A filter and a decimator turn the stream into samples; the ESP32 and ESP32-S3 do this in hardware, in I2S block 0. Two wires, clock and data, are enough: the M5Stack ATOM Echo and the XIAO ESP32S3 Sense carry PDM microphones. The second simulation builds the stream and decodes it.

### Why the numbers look tiny

Sensitivity is quoted at 94 dB SPL, one pascal; common MEMS microphones sit near −26 dBFS there. Speech at a metre is only about 60 dB SPL, 34 dB lower, so it fills about a thousandth of the range: roughly 8 000 counts out of 8 388 608 in 24 bits. That is not a fault: remove the small DC offset, then raise the level in software with a shift (a gain of 8 or 16).

### Traps

Keep BCLK short, away from the antenna. Some parts, notably the SPH0645, send their data a little late and need a different timing setting. And a microphone records people: say so, and follow local law ([[cameras-and-the-law]]).

> [!key] Digital MEMS microphones send samples over I2S (24 bits in a 32-bit slot, L/R pin picks the slot) or a one-bit PDM stream. Read 32-bit words, shift by 8, mind the L/R pin, and expect speech to be a small number: the microphone is working.`,
  ideas: [
    'A digital microphone has its converter inside the capsule, so no weak analogue signal travels across the board.',
    'An I2S microphone speaks in the slot its L/R pin selects and releases the data line in the other: reading the wrong slot gives zeros.',
    'The 24-bit sample sits at the top of a 32-bit slot: read 32-bit words and shift right by 8.',
    'A PDM microphone sends a one-bit stream whose density of ones is the sound; the ESP32 and S3 decode it in hardware.'
  ],
  pitfalls: [
    'The program runs and every sample is zero, so the microphone is dead — Most often the L/R pin and the slot the program reads disagree. Tie L/R to ground for the left slot, or read the right one.',
    'Speech gives readings of a few thousand, so the gain is wrong — That is the true level: about a thousandth of full scale. Shift left by 3 or 4 bits in software, after removing the DC offset.',
    'An analogue microphone on the ADC is simpler and just as good — It saves two wires and costs a great deal of quality: the ESP\'s ADC is noisy, non-linear and starved by the Wi-Fi radio.'
  ],
  terms: [
    { term: 'MEMS microphone', also: ['silicon microphone', 'digital microphone'], def: 'A microphone etched in silicon, a few millimetres across. Digital versions have the converter built in and output I2S or PDM.' },
    { term: 'PDM', also: ['pulse-density modulation', 'PDM microphone'], def: 'A one-bit audio format: a fast clock and one data line, where the proportion of ones in a short stretch encodes the sound. A filter and decimator turn it into PCM samples.' },
    { term: 'L/R select', also: ['channel select', 'SEL pin'], def: 'A microphone pin that chooses its I2S slot: the left half of the frame when tied to ground, the right half when tied to the supply. In the other slot its data pin is released.' },
    { term: 'Sensitivity', also: ['dBFS at 94 dB SPL'], def: 'The output of a microphone for a standard sound of 94 dB SPL (one pascal). A digital part is quoted in dBFS, for example −26 dBFS; the higher, the louder its samples.' },
    { term: 'dB SPL', also: ['sound pressure level'], def: 'Loudness measured against the faintest sound people hear: 0 dB SPL is 20 micropascals, 60 dB SPL ordinary speech at a metre, 94 dB SPL one pascal, 120 dB SPL painful.' },
    { term: 'DC offset', also: ['bias'], def: 'A small constant added to every sample, so that silence reads a little above or below zero. Remove it with a high-pass filter or by subtracting the average.' }
  ],
  choose: {
    good: ['An I2S MEMS microphone for speech, level meters and wake words', 'The PDM microphone already on a board such as the ATOM Echo or XIAO ESP32S3 Sense, on an ESP32 or ESP32-S3', 'Two I2S microphones sharing one data line, with L/R tied differently, for a stereo pair'],
    avoid: ['The ESP\'s ADC with an analogue microphone when quality matters', 'Long wires on the bit clock, or running it beside the antenna', 'Putting the I2S pins on strapping or flash pins'],
    check: ['That the L/R pin matches the slot your program reads', 'That your code reads 32-bit words and shifts by 8 for 24-bit parts', 'That your chip\'s I2S block supports PDM, if the microphone is PDM (the ESP32 and ESP32-S3 do)']
  },
  code: [
    {
      title: 'A sound-level meter with an I2S microphone',
      about: 'Reads 512 samples at a time (32 ms), removes nothing, and prints the root-mean-square level, the peak and the level in dBFS. Clap near the microphone and watch the numbers jump.',
      needs: 'An ESP32 DevKit and an INMP441-type I2S microphone with its L/R pin tied to GND (left slot).',
      wiring: [['GPIO32', 'microphone SCK (bit clock)'], ['GPIO25', 'microphone WS (word select)'], ['GPIO33', 'microphone SD (data out)'], ['3V3', 'microphone VDD'], ['GND', 'microphone GND and L/R']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2S input: BCLK (32) WS (25) data (33) at (16000) Hz, 32 bit mono, left slot :: sound
        forever
          set [block v] to (read (512) samples from I2S :: sound)
          set [rms v] to (root mean square of (block) shifted right by (8) bits)
          set [peak v] to (largest absolute value in (block) shifted right by (8) bits)
          print (join [rms ] (rms) [  peak ] (peak) [  level ] (20 * (log10 ((rms) / (8388608)))) [ dBFS])
        end
      `,
      cpp: String.raw`
        #include <ESP_I2S.h>

        I2SClass i2s;

        const int PIN_BCLK = 32, PIN_WS = 25, PIN_DIN = 33;   // microphone SCK, WS and SD
        const int RATE = 16000;
        const int N = 512;                                    // samples per measurement: 32 ms
        int32_t buf[N];

        void setup() {
          Serial.begin(115200);
          i2s.setPins(PIN_BCLK, PIN_WS, -1, PIN_DIN);         // (bclk, ws, dout, din): dout is not used
          if (!i2s.begin(I2S_MODE_STD, RATE, I2S_DATA_BIT_WIDTH_32BIT, I2S_SLOT_MODE_MONO)) {
            Serial.println("I2S start failed");
            while (true) delay(1000);
          }
        }

        void loop() {
          size_t got = i2s.readBytes((char *)buf, sizeof(buf)) / sizeof(int32_t);
          if (got == 0) return;
          double sum = 0;
          int32_t peak = 0;
          for (size_t i = 0; i < got; i++) {
            int32_t s = buf[i] >> 8;                          // the 24 data bits sit at the top of the word
            sum += (double)s * s;
            if (abs(s) > peak) peak = abs(s);
          }
          double rms = sqrt(sum / got);
          double dbfs = 20.0 * log10((rms + 1.0) / 8388608.0);   // 2^23 is full scale for 24 bits
          Serial.printf("rms %.0f  peak %ld  level %.1f dBFS\n", rms, (long)peak, dbfs);
        }
      `,
      py: String.raw`
        from machine import I2S, Pin
        import array, math

        PIN_BCLK, PIN_WS, PIN_DIN = 32, 25, 33            # microphone SCK, WS and SD
        RATE = 16000
        N = 512                                           # samples per measurement: 32 ms

        mic = I2S(0, sck=Pin(PIN_BCLK), ws=Pin(PIN_WS), sd=Pin(PIN_DIN),
                  mode=I2S.RX, bits=32, format=I2S.MONO, rate=RATE, ibuf=8192)
        buf = array.array("i", [0] * N)                   # 32-bit signed samples

        while True:
            got = mic.readinto(buf) // 4                  # bytes to samples
            if got == 0:
                continue
            total = 0
            peak = 0
            for i in range(got):
                s = buf[i] >> 8                           # the 24 data bits sit at the top of the word
                total += s * s
                peak = max(peak, abs(s))
            rms = math.sqrt(total / got)
            dbfs = 20 * math.log10((rms + 1) / 8388608)   # 2**23 is full scale for 24 bits
            print("rms %.0f  peak %d  level %.1f dBFS" % (rms, peak, dbfs))
      `,
      output: `
        rms 7420  peak 21310  level -61.0 dBFS
        rms 8105  peak 23988  level -60.3 dBFS
        rms 612044  peak 2410331  level -22.7 dBFS      (a clap)
      `,
      notes: ['If every reading is 0 or 1, the microphone is answering in the other slot: tie L/R to ground, or read the right slot.', 'The rms includes the microphone\'s DC offset, so a silent room does not read zero. Subtract the block average for a cleaner figure.', 'The MicroPython version is slow: a Python loop over 512 samples takes a few milliseconds per pass, which is acceptable for a meter but not for filtering every sample.']
    },
    {
      title: 'A serial bar-graph from a PDM microphone',
      about: 'Reads 16-bit samples from a PDM microphone and prints a row of # characters whose length follows the loudness of the last 20 ms.',
      needs: 'A Seeed Studio XIAO ESP32S3 Sense (PDM microphone on GPIO41 data and GPIO42 clock). On the original ESP32 use I2S port 0 with any two free pins.',
      wiring: [['GPIO42', 'PDM microphone CLK', 'on the board'], ['GPIO41', 'PDM microphone DATA', 'on the board']],
      blocks: `
        when started
          start serial at (115200) baud
          start PDM microphone: clock (42) data (41) at (16000) Hz, 16 bit mono :: sound
        forever
          set [block v] to (read (320) samples from PDM microphone :: sound)
          set [level v] to (largest absolute value in (block))
          print (repeat text [#] (map (level) from (0) (8000) to (0) (60)))
        end
      `,
      cpp: String.raw`
        #include <ESP_I2S.h>

        I2SClass i2s;

        const int PIN_CLK = 42, PIN_DATA = 41;      // the board's PDM microphone
        const int N = 320;                          // 20 ms at 16 kHz
        int16_t buf[N];

        void setup() {
          Serial.begin(115200);
          i2s.setPinsPdmRx(PIN_CLK, PIN_DATA);
          if (!i2s.begin(I2S_MODE_PDM_RX, 16000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO)) {
            Serial.println("PDM start failed");
            while (true) delay(1000);
          }
        }

        void loop() {
          size_t got = i2s.readBytes((char *)buf, sizeof(buf)) / sizeof(int16_t);
          int peak = 0;
          for (size_t i = 0; i < got; i++) if (abs(buf[i]) > peak) peak = abs(buf[i]);
          int bars = constrain(map(peak, 0, 8000, 0, 60), 0, 60);   // 60 characters at most
          for (int i = 0; i < bars; i++) Serial.print('#');
          Serial.println();
        }
      `,
      na: { py: 'MicroPython\'s machine.I2S class has only the standard transmit and receive modes in version 1.29, with no PDM input. Use C++ for a PDM microphone, or a microphone with an I2S output.' },
      output: `
        ###
        ####
        ##########################
        ##################################################
        ####
      `,
      notes: ['The PDM-to-sample conversion is done in hardware, so the program sees ordinary 16-bit samples.', 'The 8000 in the map() call is a guess at a loud-speech peak for this microphone: lower it to make the bars more sensitive.', 'GPIO41 and GPIO42 are JTAG pins on the ESP32-S3; they are free while the built-in USB serial/JTAG port is the debug interface.']
    }
  ],
  examples: [
    {
      title: 'How big should speech look?',
      q: 'A microphone has a sensitivity of −26 dBFS at 94 dB SPL. A person talks at 60 dB SPL at the microphone. What amplitude, in 24-bit counts, do you expect?',
      steps: ['The talker is $94 - 60 = 34$ dB below the reference.', 'The output is then $-26 - 34 = -60$ dBFS, which is $10^{-60/20} = 0.001$ of full scale.', 'Full scale is $2^{23} = 8\\,388\\,608$ counts, so the amplitude is about $0.001 \\times 8\\,388\\,608 \\approx 8\\,400$ counts.'],
      a: 'About 8 400 counts of 8.4 million: a thousandth of full scale. To use 16 bits of dynamic range for speech, shift left by 3 to 4 bits after removing the offset.'
    }
  ],
  quiz: [
    { q: 'An I2S microphone\'s L/R pin is tied to 3.3 V, and the program reads the left slot. What does it read?', choices: ['Normal samples', 'Samples at half volume', 'Zeros: the microphone speaks in the right slot', 'An error from the driver'], a: 2, why: 'The pin selects the slot. In the left slot the microphone\'s data pin is released, so the ESP reads a constant level. Nothing signals an error.' },
    { q: 'An INMP441 sends 24-bit samples. Which settings give the right number from a 32-bit read?', choices: ['Shift right by 8', 'Shift left by 8', 'Read 24-bit slots', 'No change: the value is already right'], a: 0, why: 'The 24 data bits sit at the top of the 32-bit slot, followed by eight zero bits. An arithmetic shift right by 8 gives the signed 24-bit value.' },
    { q: 'Speech through a microphone reads a few thousand counts out of 8 388 608. The microphone is faulty.', a: false, why: 'Speech at a metre is some 34 dB below the 94 dB SPL reference, about a thousandth of full scale. That is the true level; apply gain in software.' },
    { q: 'Which statement about PDM microphones is correct?', choices: ['They have a word-select line', 'They send a one-bit stream whose density of ones follows the sound', 'They need an ADC pin', 'They work on every ESP chip'], a: 1, why: 'A PDM microphone has only clock and data. The ESP32 and S3 decode the stream in the I2S block; other chips may not have that hardware.' }
  ],
  applications: [
    'Voice assistants, smart speakers and wake-word devices (every voice board carries digital microphones).',
    'Noise monitors and sound-level meters for a room, a workshop or a machine.',
    'Clap switches and sound-triggered cameras.',
    'Listening to machines: a change in a motor\'s sound often shows before a fault does ([[fft-and-spectrum]]).'
  ],
  sources: [
    'Datasheets of the INMP441, ICS-43434 and SPH0645 I2S microphones and of the SPM1423 PDM microphone (output format, sensitivity, L/R select).',
    'Espressif, *ESP-IDF Programming Guide*, I2S: standard mode and PDM RX mode.',
    'Arduino core for ESP32 documentation, *I2S* (ESP_I2S) API; MicroPython documentation, class *machine.I2S* (version 1.29).'
  ],
  sim: ['au-i2s-mic', 'au-pdm']
},

/* ================================================================ i2s-amplifiers-and-dacs */
{
  id: 'i2s-amplifiers-and-dacs',
  parent: 'audio',
  title: 'I2S amplifiers and DACs',
  level: 2,
  short: 'Two ways to make sound from I2S samples: an amplifier chip that takes the samples and drives a speaker directly (MAX98357A), or a DAC that makes a line-level signal for an amplifier you already have (PCM5102). What each needs, what each cannot do, and how to keep the ESP alive.',
  keywords: ['MAX98357A', 'PCM5102', 'UDA1334', 'class D', 'DAC', 'amplifier', 'speaker', 'I2S', 'line level', 'GAIN pin', 'SD_MODE', 'PAM8403', 'PWM audio', 'speaker 4 ohm', 'headphones', 'click', 'pop', 'brownout', 'NS4168'],
  prereq: ['digital-audio-basics', 'i2s', 'dac-output'],
  related: ['i2s-microphones', 'audio-codecs', 'playing-audio-files', 'bluetooth-audio', 'brownout', 'current-peaks-and-capacitors', 'buzzers-and-tones', 'external-adc-and-dac'],
  body: `The ESP's own pins cannot drive a speaker: a small speaker is a coil of a few ohms, and a GPIO gives tens of milliamperes. Sound needs a converter from samples to a voltage and an amplifier to turn that voltage into power. I2S parts do one or both.

### The amplifier with an I2S input

The MAX98357A is the common one. It is a class-D amplifier: it turns the incoming samples straight into a fast on-off signal that drives the speaker, with no analogue stage and little heat. It needs only BCLK, LRC (word select) and DIN, no master clock, and a supply of 2.5 to 5.5 V. At 5 V it can deliver roughly 3 W into a 4 Ω speaker; at 3.3 V far less. The GAIN pin sets the gain in steps of 3 dB, and the SD_MODE pin switches it off or selects the left channel, the right channel or the mix of the two (it is a mono part). Its output is a bridge: **neither speaker wire may touch ground**. The same idea sits in the NS4168 and NS4150 amplifiers found on the M5Stack and Espressif voice boards.

### The DAC with a line output

The PCM5102 (and the older UDA1334) is only a converter. It takes I2S and puts a stereo analogue signal of about two volts peak-to-peak on its output pins: a *line level*, to be plugged into an amplifier, powered speakers, a hi-fi or headphones with their own amplifier. It is the better choice when sound quality matters or when an amplifier already exists. The PCM5102 makes its own master clock when its SCK pin is tied to ground, the usual arrangement on its breakout board; check the board's solder jumpers for the filter, the mute and the format.

### What is not an option

The original ESP32 and the S2 have an 8-bit DAC ([[dac-output]]), which makes audible hiss and cannot drive a speaker. In the newest Arduino core, the old trick of feeding it from I2S has gone with the legacy driver. PWM from a pin plus a filter makes tolerable beeps ([[buzzers-and-tones]]), not music.

### Keeping the system alive

- **Power.** Loud passages draw current in bursts of an ampere or more from a 5 V supply. A thin USB cable or a weak regulator sags, and the ESP browns out and resets in time with the music ([[brownout]]). Feed the amplifier from 5 V directly, add a large capacitor close to it, and keep the volume low while testing.
- **Clicks.** Starting or stopping the stream with a nonzero level thumps. Ramp the volume up and down over 10 to 20 ms.
- **Interference.** A class-D output is a fast square wave on a wire. Keep speaker leads short and away from the antenna.

> [!key] An I2S amplifier (MAX98357A) takes samples and drives a speaker directly; an I2S DAC (PCM5102) makes a line-level signal for an amplifier you provide. Power the amplifier properly, ramp the volume to avoid clicks, and never connect a bridge output to ground.`,
  ideas: [
    'A GPIO cannot drive a speaker; a converter and an amplifier must sit between the samples and the coil.',
    'The MAX98357A is an I2S input class-D amplifier for a speaker of 4 to 8 Ω: no master clock, no analogue wiring, mono.',
    'The PCM5102 is a DAC: it makes a line-level signal for an amplifier you supply and gives the better sound.',
    'Loud sound draws current bursts that can reset the ESP; give the amplifier a solid supply and ramp the volume.'
  ],
  pitfalls: [
    'I can connect a small speaker to a GPIO through a resistor — That is a way to hear a faint buzz and risk the pin. A speaker needs real current: use an amplifier.',
    'The amplifier output is a normal signal with one side grounded — It is a bridge-tied load: both wires carry the signal. Grounding one side shorts an output stage.',
    'Reset-on-loud-music is a software bug — It is usually the supply sagging under the amplifier\'s current bursts, tripping the brownout detector.'
  ],
  terms: [
    { term: 'Class-D amplifier', also: ['switching amplifier', 'digital amplifier'], def: 'An amplifier whose output stage switches fully on and off thousands of times a second; the speaker\'s own inductance averages the pulses. It is efficient and runs cool.' },
    { term: 'DAC', also: ['digital-to-analogue converter'], def: 'A chip that turns a stream of sample values into a voltage. An I2S DAC receives the stream over I2S; it needs an amplifier to drive anything but headphones or a line input.' },
    { term: 'Line level', also: ['line out'], def: 'The standard signal between audio devices: about one to two volts peak-to-peak at a few kilohms. It is meant to be amplified, not to drive a speaker.' },
    { term: 'Bridge-tied load', also: ['BTL', 'differential output'], def: 'An amplifier output where the speaker sits between two driven terminals. It gives more power from a low supply, and means neither speaker wire may be grounded.' },
    { term: 'Ramp', also: ['fade', 'soft start'], def: 'Changing the volume gradually over a few milliseconds at the start and end of a sound, so that the speaker is not asked to jump, which would click.' }
  ],
  choose: {
    good: ['MAX98357A for a small speaker straight from the ESP: voice prompts, a radio, an alarm', 'PCM5102 into powered speakers or a hi-fi for music quality', 'A speaker of 4 to 8 Ω in a box, rated above the amplifier\'s power'],
    avoid: ['Driving a speaker from a GPIO, even with a resistor', 'Grounding either output of a bridge amplifier', 'Powering a loud amplifier from the ESP board\'s weak 3.3 V pin'],
    check: ['The supply voltage and the power into your speaker\'s impedance', 'The GAIN setting before the first loud test', 'The breakout board\'s jumpers (PCM5102: filter, mute, format) and its power pin']
  },
  code: [
    {
      title: 'A rising scale with soft edges',
      about: 'Plays the eight notes of a C major scale, 300 ms each, from a sine computed on the fly. Each note fades in and out over 15 ms so that it starts and stops without a click.',
      needs: 'An ESP32 DevKit, a MAX98357A breakout and a speaker of 4 to 8 Ω on its output, with the amplifier fed from 5 V. Keep the amplifier\'s gain low.',
      wiring: [['GPIO27', 'amplifier BCLK'], ['GPIO25', 'amplifier LRC'], ['GPIO26', 'amplifier DIN'], ['5V', 'amplifier VIN'], ['GND', 'amplifier GND']],
      blocks: `
        when started
          set [notes v] to (list (262) (294) (330) (349) (392) (440) (494) (523))
          start I2S output: BCLK (27) LRC (25) data (26) at (16000) Hz, 16 bit stereo :: sound
          for each [f v] in (notes)
            play tone (f) Hz for (0.3) seconds with 15 ms fade at both ends on I2S :: sound
          end
          stop [this script v]
      `,
      cpp: String.raw`
        #include <ESP_I2S.h>

        I2SClass i2s;

        const int PIN_BCLK = 27, PIN_LRC = 25, PIN_DOUT = 26;
        const int RATE = 16000;
        const float VOLUME = 0.2;                                   // 0 to 1: keep it low
        const int NOTES[] = {262, 294, 330, 349, 392, 440, 494, 523};   // C4 to C5, in Hz

        void playNote(int freq, int ms) {
          int total = RATE * ms / 1000;
          int fade = RATE * 15 / 1000;                              // 15 ms fade in and out
          for (int n = 0; n < total; n++) {
            float env = 1.0;
            if (n < fade) env = (float)n / fade;
            if (n > total - fade) env = (float)(total - n) / fade;
            int16_t s = (int16_t)(32767 * VOLUME * env * sin(2 * PI * freq * n / RATE));
            i2s.write((uint8_t *)&s, sizeof(s));                    // left (the library takes bytes)
            i2s.write((uint8_t *)&s, sizeof(s));                    // right
          }
        }

        void setup() {
          i2s.setPins(PIN_BCLK, PIN_LRC, PIN_DOUT);
          if (!i2s.begin(I2S_MODE_STD, RATE, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_STEREO)) while (true) delay(1000);
          for (int f : NOTES) playNote(f, 300);
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2S, Pin
        from array import array
        import math

        PIN_BCLK, PIN_LRC, PIN_DOUT = 27, 25, 26
        RATE = 16000
        VOLUME = 0.2                                      # 0 to 1: keep it low
        NOTES = (262, 294, 330, 349, 392, 440, 494, 523)  # C4 to C5, in Hz

        audio = I2S(0, sck=Pin(PIN_BCLK), ws=Pin(PIN_LRC), sd=Pin(PIN_DOUT),
                    mode=I2S.TX, bits=16, format=I2S.STEREO, rate=RATE, ibuf=8000)

        def play_note(freq, ms):
            total = RATE * ms // 1000
            fade = RATE * 15 // 1000                      # 15 ms fade in and out
            buf = array("h", [0] * (2 * total))           # left and right interleaved
            for n in range(total):
                env = 1.0
                if n < fade:
                    env = n / fade
                if n > total - fade:
                    env = (total - n) / fade
                s = int(32767 * VOLUME * env * math.sin(2 * math.pi * freq * n / RATE))
                buf[2 * n] = s                            # left
                buf[2 * n + 1] = s                        # right
            audio.write(buf)

        for f in NOTES:
            play_note(f, 300)
        audio.deinit()
      `,
      notes: ['Computing 4 800 sine values per note is easy for the ESP32; for a long sound compute a table once, or stream a file ([[playing-audio-files]]).', 'Remove the fade (set fade to 0) and listen: every note starts with a tick. That tick is what the ramp prevents.', 'The MicroPython version builds a whole note in memory (19 KB) before writing it; the write call then waits until the data is queued.']
    }
  ],
  examples: [
    {
      title: 'What power does an amplifier give a speaker?',
      q: 'A class-D amplifier on a 5 V supply drives a 4 Ω speaker with a bridged output. Ignoring losses, what is the most power a sine wave can give, and what is it from a 3.3 V supply?',
      steps: ['A bridge can swing the speaker by nearly the full supply, so the peak voltage is about $V_{cc}$ and the RMS voltage $V_{cc}/\\sqrt{2}$.', 'Power is $P = V_{rms}^2 / R = V_{cc}^2 / (2R)$.', 'At 5 V: $25 / 8 \\approx 3.1$ W. At 3.3 V: $10.9 / 8 \\approx 1.4$ W.', 'Real amplifiers lose a little to resistance and distortion, so the datasheet figures are somewhat lower, but the ratio holds: lowering the supply to 3.3 V halves the power.'],
      a: 'About 3 W at 5 V and about 1.4 W at 3.3 V, into 4 Ω, at the limit of clipping. Ordinary listening uses a fraction of that.'
    }
  ],
  quiz: [
    { q: 'Which part can drive a 4 Ω speaker directly from I2S samples?', choices: ['PCM5102', 'MAX98357A', 'The ESP32\'s 8-bit DAC', 'A GPIO pin'], a: 1, why: 'The MAX98357A is a class-D amplifier with an I2S input. The PCM5102 only makes a line-level signal, and the DAC and GPIO give far too little current.' },
    { q: 'You connect one wire of the speaker to the amplifier\'s output and the other to ground, because the speaker has a ground-coloured lead. What is wrong?', choices: ['Nothing, that is the usual way', 'The output is a bridge: both terminals are driven, and grounding one stresses the output stage', 'The sound will be too quiet only', 'The ESP will not boot'], a: 1, why: 'A bridge-tied load needs the speaker between its two output terminals. Grounding one side shorts that output.' },
    { q: 'The ESP resets in time with loud music through a small amplifier. The likeliest cause is…', choices: ['The sample rate is wrong', 'The supply sags under the amplifier\'s current bursts', 'The speaker is the wrong colour', 'The I2S word select is inverted'], a: 1, why: 'Loud passages draw current peaks; a weak supply or thin cable sags, and the brownout detector resets the chip. Feed the amplifier from a solid 5 V and add a capacitor.' },
    { q: 'A PCM5102 board gives enough power to drive a small speaker.', a: false, why: 'It is a DAC with a line-level output, around two volts and a few milliamperes. It needs an amplifier or powered speakers after it.' }
  ],
  applications: [
    'Voice prompts and alarms from a small ESP board with a MAX98357A and a 3 W speaker.',
    'A network music player or internet radio ([[internet-radio]]) feeding powered speakers through a PCM5102.',
    'Smart speakers: the NS4168 and NS4150 amplifiers on the ATOM Echo and the Espressif voice boards.',
    'A Bluetooth speaker built on an ESP32 ([[bluetooth-audio]]).'
  ],
  sources: [
    'Datasheets of the MAX98357A (I2S input class-D amplifier) and the PCM5102A (stereo DAC).',
    'Espressif, *ESP-IDF Programming Guide*, I2S standard mode (clock and slot configuration).',
    'Arduino core for ESP32 documentation, *I2S* (ESP_I2S) API; MicroPython documentation, class *machine.I2S*.'
  ],
  sim: 'au-amp'
},

/* ================================================================ audio-codecs */
{
  id: 'audio-codecs',
  parent: 'audio',
  title: 'Audio codecs',
  level: 3,
  short: 'A codec chip holds the converters, the amplifiers and the volume control of a whole audio path in one package, set up over I2C and fed over I2S. Why voice boards use them, what the ES8311, ES8388 and ES7210 each do, and what you must send before any sound comes out.',
  keywords: ['codec', 'ES8311', 'ES8388', 'ES7210', 'AC101', 'WM8978', 'TLV320', 'MCLK', 'master clock', 'I2C control', 'headphone amplifier', 'microphone array', 'echo cancellation', 'esp_codec_dev', 'LyraT', 'Korvo', 'ESP-ADF', 'audio chip'],
  prereq: ['i2s-microphones', 'i2s-amplifiers-and-dacs', 'i2c-addresses-and-scanning'],
  related: ['i2s', 'camera-and-audio-kits', 'esp32-s3-box', 'home-assistant-voice-hardware', 'wake-words-and-speech-commands', 'strapping-pins', 'registers-and-datasheets'],
  body: `A microphone, a speaker amplifier and a plain I2S link are enough for a beeper or a recorder. A device that listens *and* speaks, as a voice assistant does, wants more: microphone preamplifiers, converters both ways, a volume control, a headphone socket. A **codec** (coder-decoder) is one chip that holds all of it. It has two interfaces: a **control bus**, normally I2C, over which you write its registers, and an **audio bus**, normally I2S, over which the samples flow in both directions.

### The three you will meet

| Chip | What it is | Where the catalogue has it |
|---|---|---|
| ES8311 | A mono codec: one ADC, one DAC, low power | ESP32-S3-Korvo-1 and Korvo-2, ESP-VoCat, M5Stack Atom VoiceS3R |
| ES8388 | A stereo codec: two ADCs, two DACs, microphone and headphone amplifiers | ESP32-LyraT, Ai-Thinker ESP32-Audio-Kit (early boards: AC101) |
| ES7210 | A four-channel ADC for microphone arrays; it only listens | Korvo-1 and Korvo-2, ESP-VoCat, beside an ES8311 |

The ES7210 plus ES8311 pair is the pattern of the Espressif voice boards: several microphones in, one speaker out, with the speaker signal fed back into an extra channel so that the processing can subtract the board's own sound from what the microphones hear (echo cancellation, [[wake-words-and-speech-commands]]). The M5Stack ATOM Echo has no codec: a PDM microphone and a small I2S amplifier, simpler and cheaper.

### Two buses, one clock

The audio side is I2S with one change: **full duplex**. DOUT goes to the codec's DAC, DIN comes from its ADC, and BCLK and WS are shared. Most codecs also want an **MCLK**, a master clock that is a multiple of the sample rate, usually 256 times; some can derive it from the bit clock. On the Atom VoiceS3R the catalogue gives MCLK on GPIO11, BCLK on GPIO17, WS on GPIO3, DOUT on GPIO48 and DIN on GPIO4, and the control bus on GPIO45 and GPIO0. Clock settings, gain and volume are all registers.

### What you must write first

The datasheet gives each chip a start-up sequence of dozens of register writes: power the analogue parts, choose the rate and word length, route the ADC and DAC, set the gains. Nobody types it by hand: Espressif's *esp_codec_dev* component and the board support packages carry it, and for Arduino you use the maker's example. An **amplifier enable** pin (GPIO21 on the Ai-Thinker kit, GPIO18 on the Atom VoiceS3R) must also be raised.

### Finding it

Ask the control bus who is there: a codec that does not answer an I2C scan is unpowered, wired wrong or held in reset. Usual addresses are 0x18 or 0x19 for the ES8311, 0x10 or 0x11 for the ES8388 and 0x40 to 0x43 for the ES7210 ([[i2c-addresses-and-scanning]]). The program below prints them.

> [!key] A codec packs the converters, amplifiers and volume of an audio path into one chip, controlled over I2C and fed over I2S in both directions, usually with an MCLK of 256 times the sample rate. It does nothing until its registers are written: scan the control bus, then use the board's driver.`,
  ideas: [
    'A codec combines ADC, DAC, microphone preamplifier, volume and sometimes a headphone amplifier, behind an I2C control bus and an I2S audio bus.',
    'ES8311 is a mono codec, ES8388 a stereo one, ES7210 a four-channel microphone ADC; voice boards pair an ES7210 with an ES8311.',
    'Most codecs need an MCLK, typically 256 times the sample rate, and stay silent until a start-up sequence of register writes has run.',
    'An I2C scan that finds nothing means power, wiring or reset, not software: check that before anything else.'
  ],
  pitfalls: [
    'A codec is plug and play on I2S — The I2S side carries only samples. Clock, routing, gain and volume are registers that must be written over I2C first, or the output is silent.',
    'The I2C address in the datasheet is what I will find — Address pins change it (0x18 or 0x19 for an ES8311), and some boards need a power-enable pin raised before the chip answers.',
    'The master clock is optional because the sample rate is set in software — Many codecs derive all their internal timing from MCLK. Without it, or at the wrong ratio, the chip is mute or plays at a wrong pitch.'
  ],
  terms: [
    { term: 'Codec', also: ['audio codec', 'coder-decoder'], def: 'A chip with an ADC and a DAC (and usually preamplifiers, volume control and an output amplifier) for one audio path. In this topic, the hardware kind; a file format such as MP3 is the software kind.' },
    { term: 'MCLK', also: ['master clock', 'system clock'], def: 'A clock, typically 256 times the sample rate, that a codec uses to time its converters and filters. Some codecs can make it from the bit clock instead.' },
    { term: 'Full duplex', also: ['duplex I2S'], def: 'Sending and receiving at once: one data line from the ESP to the codec\'s DAC and another from the codec\'s ADC to the ESP, sharing the bit clock and word select.' },
    { term: 'Echo cancellation', also: ['AEC'], def: 'Removing the device\'s own loudspeaker sound from the microphone signal, using a copy of what was played. It lets a speaker hear a wake word over its own music.' },
    { term: 'Amplifier enable', also: ['PA enable', 'speaker enable'], def: 'A GPIO that switches the power amplifier after the codec on. The speaker stays silent until the program raises it.' }
  ],
  choose: {
    good: ['A codec board for a speaker that must listen while it plays, with echo cancellation (ES7210 with ES8311 style)', 'A stereo codec such as the ES8388 for line input, line output and headphones', 'A board with a published driver and example for exactly that board'],
    avoid: ['A codec when an I2S microphone and a MAX98357A would do the job with far less setup', 'A codec nobody has written a driver for on your software stack', 'Skipping the I2C scan and guessing at addresses'],
    check: ['That the chip answers on I2C at the address you expect', 'The MCLK pin and the ratio the codec wants', 'The amplifier-enable and any codec power-enable pins, and their start-up order']
  },
  code: [
    {
      title: 'Ask the control bus who is there',
      about: 'Scans the I2C bus and names the audio codecs it finds from their usual addresses. The pins are those of the M5Stack Atom VoiceS3R, whose ES8311 sits on GPIO45 (SDA) and GPIO0 (SCL). Change them for your board.',
      needs: 'An M5Stack Atom VoiceS3R (ESP32-S3) and the serial monitor at 115200 baud.',
      wiring: [['GPIO45', 'codec SDA', 'on the board'], ['GPIO0', 'codec SCL', 'on the board; also the boot pin, held high by the pull-up']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (45) SCL (0)
          set [found v] to (scan the I2C bus :: bus)
          for each [a v] in (found)
            print (join [address ] (hex of (a)) [  ] (audio chip name for address (a)))
          end
          print (join (length of (found)) [ device(s) found])
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 45, SCL_PIN = 0;       // the codec's control bus on the Atom VoiceS3R

        const char *nameOf(uint8_t a) {            // the usual addresses; address pins can change them
          if (a == 0x18 || a == 0x19) return "ES8311 codec (usual address)";
          if (a == 0x10 || a == 0x11) return "ES8388 codec (usual address)";
          if (a >= 0x40 && a <= 0x43) return "ES7210 four-microphone ADC (usual address)";
          return "unknown device";
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          Wire.begin(SDA_PIN, SCL_PIN, 100000);    // (sda, scl, frequency)
          int found = 0;
          for (uint8_t a = 1; a < 127; a++) {
            Wire.beginTransmission(a);
            if (Wire.endTransmission() == 0) {     // 0: the device acknowledged
              Serial.printf("address 0x%02X  %s\n", a, nameOf(a));
              found++;
            }
          }
          Serial.printf("%d device(s) found\n", found);
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin

        SDA_PIN, SCL_PIN = 45, 0                   # the codec's control bus on the Atom VoiceS3R

        def name_of(a):                            # the usual addresses; address pins can change them
            if a in (0x18, 0x19):
                return "ES8311 codec (usual address)"
            if a in (0x10, 0x11):
                return "ES8388 codec (usual address)"
            if 0x40 <= a <= 0x43:
                return "ES7210 four-microphone ADC (usual address)"
            return "unknown device"

        i2c = I2C(0, sda=Pin(SDA_PIN), scl=Pin(SCL_PIN), freq=100000)
        found = i2c.scan()                         # list of addresses that acknowledged
        for a in found:
            print("address 0x%02X  %s" % (a, name_of(a)))
        print(len(found), "device(s) found")
      `,
      output: `
        address 0x18  ES8311 codec (usual address)
        1 device(s) found
      `,
      notes: ['If the scan finds nothing, the codec may be switched off: some boards need a power-enable pin raised first. Read the board\'s schematic or example.', 'This only finds the chip. Making sound still needs the codec\'s register sequence: use the board\'s driver or the esp_codec_dev component.', 'The ES8311 and ES8388 answers depend on the address pin; the table in the datasheet lists the alternatives.']
    }
  ],
  formulas: [
    {
      name: 'The master clock a codec wants',
      expr: 'fm = k*fs',
      tex: 'f_{MCLK} = k \\, f_s',
      vars: {
        fm: { name: 'master clock', tex: 'f_{MCLK}', q: 'frequency', unit: 'MHz' },
        k: { name: 'ratio (256 is the usual choice)', value: 256, min: 64, max: 1536, int: true },
        fs: { name: 'sample rate', tex: 'f_s', q: 'frequency', unit: 'kHz', value: 16 }
      },
      solveFor: 'fm',
      note: 'Codec datasheets list the ratios they accept (256, 384, 512 and others). Standard rates such as 44.1 kHz need a different master clock from 48 kHz: 11.2896 MHz and 12.288 MHz at the ratio 256.',
      stories: { fm: 'A codec runs at a sample rate of {fs} with a ratio of {k}. What master clock must the ESP supply?', fs: 'A codec receives a master clock of {fm} at the ratio {k}. What sample rate does it run?' },
      practice: { unknowns: ['fm', 'fs'] }
    }
  ],
  examples: [
    {
      title: 'Which master clock for CD-rate sound?',
      q: 'A codec needs MCLK = 256 × the sample rate. What MCLK does it need at 44.1 kHz and at 16 kHz?',
      steps: ['At 44.1 kHz: $256 \\times 44\\,100 = 11\\,289\\,600$ Hz, 11.2896 MHz.', 'At 16 kHz: $256 \\times 16\\,000 = 4\\,096\\,000$ Hz, 4.096 MHz.', 'The ESP\'s I2S block makes the clock from its own source, so each rate gives a slightly different real figure; the driver chooses the nearest it can.'],
      a: '11.2896 MHz at 44.1 kHz and 4.096 MHz at 16 kHz.'
    }
  ],
  quiz: [
    { q: 'An ES8311 board is wired correctly and the program sends perfect I2S samples, but nothing comes out. What is the most likely missing step?', choices: ['A longer cable', 'The codec\'s register start-up sequence over I2C', 'A higher sample rate', 'A different pin for BCLK'], a: 1, why: 'A codec does not play what arrives on I2S until its registers set the clocking, the routing and the gain, and the amplifier is enabled.' },
    { q: 'Why do Espressif\'s voice boards pair an ES7210 with an ES8311?', choices: ['The ES7210 is cheaper per channel only', 'The ES7210 gives several microphone channels, including the speaker feed-back for echo cancellation, and the ES8311 drives the speaker', 'Neither works alone', 'Both are needed for I2C'], a: 1, why: 'A four-channel ADC takes the microphone array and a loopback of the playback signal; the mono codec plays the sound. Together they give a speaker that can listen while it speaks.' },
    { q: 'An I2C scan finds no codec. Which is the best first suspicion?', choices: ['The Wi-Fi password', 'Power, wiring, address or reset of the codec', 'The MP3 decoder', 'The sample rate'], a: 1, why: 'A device that does not acknowledge its address is not reachable: unpowered, held in reset, wired wrong or at another address. Fix that before any audio software.' },
    { q: 'Full duplex I2S to a codec uses one data wire for both directions.', a: false, why: 'It uses two data lines, DOUT to the DAC and DIN from the ADC, which share BCLK, WS and often MCLK.' }
  ],
  applications: [
    'Smart speakers and voice assistants: the Espressif Korvo and VoCat boards and the M5Stack Atom VoiceS3R.',
    'Audio kits with line input and headphone output for MP3 players and internet radios: the LyraT and the Ai-Thinker Audio Kit.',
    'Intercoms and voice-over-IP gadgets that must listen and speak at once.',
    'Anything with a headphone socket and a volume control that the program can set.'
  ],
  sources: [
    'Datasheets of the ES8311, ES8388 and ES7210 audio chips (Everest Semiconductor): register maps and start-up sequences.',
    'Espressif, user guides of the ESP32-LyraT and ESP32-S3-Korvo boards, and the *esp_codec_dev* component documentation.',
    'M5Stack, documentation of the Atom VoiceS3R (pin map).'
  ]
},

/* ================================================================ playing-audio-files */
{
  id: 'playing-audio-files',
  parent: 'audio',
  title: 'Playing WAV and MP3',
  level: 2,
  short: 'A file is read from flash or an SD card, perhaps decoded, and written to I2S fast enough that the speaker never runs dry. The WAV header, the cost of MP3, the libraries that do it, and the buffer that hides the SD card\'s pauses.',
  keywords: ['WAV', 'MP3', 'AAC', 'FLAC', 'Vorbis', 'decoder', 'ESP32-audioI2S', 'ESP8266Audio', 'arduino-audio-tools', 'ESP-ADF', 'LittleFS', 'SD card', 'buffer', 'underrun', 'PROGMEM', 'file size', 'bitrate', 'WAV header', 'RIFF'],
  prereq: ['i2s-amplifiers-and-dacs', 'littlefs-and-file-systems', 'sd-cards'],
  related: ['digital-audio-basics', 'internet-radio', 'audio-player-firmware', 'using-psram', 'partition-tables', 'buzzers-and-tones'],
  body: `Playing a recording means a small loop: read a block of the file, hand it to the I2S driver, repeat, and never be late. The speaker takes samples at a fixed rate whether the program has them or not. When the program is late, the driver has nothing to send and the sound breaks up: a click, a gap or a stutter. Everything in this page is about not being late.

### WAV: the easy case

A WAV file is **PCM behind a header**. The usual header is 44 bytes: the letters RIFF and WAVE, then the number of channels, the sample rate and the bits per sample, then the data. A player reads the header, starts I2S with those settings and sends the rest straight through; no processing. The cost is size: 16 kHz mono at 16 bits is 32 kB/s, nearly 2 MB a minute. Header traps: some tools add extra chunks (a *LIST* chunk with the title), so the data starts after byte 44 and a naive player plays the text as noise; and unsigned 8-bit files rest at 128, not at 0.

### MP3 and friends: smaller, but decoded

| Format | Typical rate | Size per minute | Needs |
|---|---|---|---|
| WAV, 16 kHz, 16-bit mono | 256 kbit/s | 1.9 MB | nothing |
| WAV, 44.1 kHz, 16-bit stereo | 1 411 kbit/s | 10.6 MB | a fast card |
| MP3, 128 kbit/s | 128 kbit/s | 0.96 MB | a decoder |
| MP3 or AAC for speech, 64 kbit/s | 64 kbit/s | 0.48 MB | a decoder |

A compressed file must be **decoded** back to samples as it plays. An ESP32 decodes MP3 in real time with spare capacity, because the decoder is light compared with the 240 MHz it runs on; the decoder's buffers want tens of kilobytes of RAM, and more with PSRAM. Single-core chips manage it with less margin. Libraries do the whole job from file to I2S: ESP32-audioI2S (MP3, AAC, WAV, FLAC, Vorbis, and web radio), ESP8266Audio (also runs on the ESP32), arduino-audio-tools (building chains of sources, filters and sinks) and Espressif's own ESP-ADF with its pipelines. Check each library's notes for your core version.

### Where the file lives

Short prompts (a beep, "door open") fit in the program as a constant array in flash; a few seconds of speech fits in a LittleFS partition ([[littlefs-and-file-systems]]); music lives on an SD card ([[sd-cards]]). SD cards read quickly on average but now and then **stall** for tens or hundreds of milliseconds while the card tidies itself. A **buffer** between the file and the I2S driver rides over that: it holds the next few hundred milliseconds of audio, and if a stall is shorter than the buffer the listener hears nothing. The simulation below shows the trade-off: a bigger buffer survives longer stalls and uses more RAM and delays the start.

> [!key] Playing a file is read, decode if needed, write to I2S, and never run dry. WAV is a 44-byte header and plain samples; MP3 is smaller but needs a decoder; a buffer hides the pauses of an SD card.`,
  ideas: [
    'The speaker consumes samples at a fixed rate; if the program is late the sound clicks or gaps.',
    'A WAV file is a header (rate, bits, channels) followed by PCM: read the header, configure I2S, stream the rest.',
    'MP3 and AAC shrink the file ten times or more but must be decoded as they play, costing CPU and buffer RAM.',
    'A buffer of a few hundred milliseconds between the card and the I2S driver hides the card\'s occasional stalls.'
  ],
  pitfalls: [
    'The WAV data always starts at byte 44 — Many files carry extra chunks. A robust player walks the chunks until it finds "data"; a naive one plays the title text as a burst of noise.',
    'A mono file can be sent to a stereo bus unchanged — Each mono sample is then read as a left and a right half: the clip plays at half speed, an octave low. Set the mono mode or duplicate the samples.',
    'Any SD card is fast enough for audio — Average speed is not the point: the longest pause is. A card that stalls for 300 ms breaks audio with a 100 ms buffer.'
  ],
  terms: [
    { term: 'WAV', also: ['RIFF WAVE', '.wav'], def: 'A file format that holds PCM audio behind a header giving the sample rate, bits per sample and channels. The simplest format to play, and the largest.' },
    { term: 'MP3', also: ['MPEG-1 Audio Layer III'], def: 'A compressed audio format that shrinks sound by discarding what listeners hardly hear. It must be decoded to samples as it plays; 128 kbit/s is common.' },
    { term: 'Decoder', also: ['audio decoder'], def: 'Software that turns a compressed stream back into PCM samples. Its cost in processor time and memory depends on the format.' },
    { term: 'Buffer', also: ['ring buffer', 'FIFO'], def: 'Memory between a source and a consumer that absorbs differences in speed: the file reader fills it unevenly and the I2S driver empties it steadily.' },
    { term: 'Underrun', also: ['buffer underrun', 'dropout'], def: 'The moment the consumer asks for samples and the buffer is empty. In audio it is heard as a click, a gap or a stutter.' }
  ],
  choose: {
    good: ['WAV from LittleFS or flash for short prompts: no decoder, no surprises', 'MP3 from an SD card for music, through a library that handles the whole chain', 'A buffer of several hundred milliseconds, filled before playback starts'],
    avoid: ['Uncompressed CD-quality WAV from a slow card', 'Playing from a card that stalls, with a tiny buffer', 'Decoding on a small single-core chip that also serves Wi-Fi'],
    check: ['The header of the files (rate, bits, channels, extra chunks)', 'That the card\'s longest pause is shorter than the buffer', 'RAM and CPU left after the decoder and the radio']
  },
  code: [
    {
      title: 'Play a WAV file from flash',
      about: 'Reads the 44-byte header of /clip.wav, starts I2S with the rate and channel count it finds, and streams the data in 2 KB blocks. The file must be 16-bit PCM and have the plain 44-byte header.',
      needs: 'An ESP32 DevKit, a MAX98357A amplifier and speaker, and a 16-bit WAV file called clip.wav uploaded to the LittleFS partition (a few seconds at 16 kHz mono).',
      wiring: [['GPIO27', 'amplifier BCLK'], ['GPIO25', 'amplifier LRC'], ['GPIO26', 'amplifier DIN'], ['5V', 'amplifier VIN'], ['GND', 'amplifier GND']],
      blocks: `
        when started
          start serial at (115200) baud
          mount the file system :: storage
          set [file v] to (open file [/clip.wav] for reading :: storage)
          set [header v] to (read (44) bytes from (file) :: storage)
          set [rate v] to (sample rate stored in (header))
          set [channels v] to (channel count stored in (header))
          print (join (rate) [ Hz, ] (channels) [ channel(s)])
          start I2S output: BCLK (27) LRC (25) data (26) at (rate) Hz, 16 bit, (channels) channel(s) :: sound
          repeat until <end of (file)>
            play (read (2048) bytes from (file)) on I2S, waiting until it is queued :: sound
          end
          print [done]
      `,
      cpp: String.raw`
        #include <LittleFS.h>
        #include <ESP_I2S.h>

        I2SClass i2s;
        const int PIN_BCLK = 27, PIN_LRC = 25, PIN_DOUT = 26;
        uint8_t chunk[2048];

        void setup() {
          Serial.begin(115200);
          if (!LittleFS.begin(true)) { Serial.println("mount failed"); return; }
          File f = LittleFS.open("/clip.wav", "r");
          if (!f) { Serial.println("clip.wav not found"); return; }

          uint8_t hdr[44];                                         // the usual WAV header
          if (f.read(hdr, 44) != 44 || memcmp(hdr, "RIFF", 4) != 0 || memcmp(hdr + 8, "WAVE", 4) != 0) {
            Serial.println("not a WAV file");
            return;
          }
          uint16_t channels = hdr[22] | (hdr[23] << 8);
          uint32_t rate = hdr[24] | (hdr[25] << 8) | (hdr[26] << 16) | ((uint32_t)hdr[27] << 24);
          uint16_t bits = hdr[34] | (hdr[35] << 8);
          Serial.printf("%u Hz, %u bit, %u channel(s)\n", (unsigned)rate, bits, channels);
          if (bits != 16) { Serial.println("only 16-bit files"); return; }

          i2s.setPins(PIN_BCLK, PIN_LRC, PIN_DOUT);
          if (!i2s.begin(I2S_MODE_STD, rate, I2S_DATA_BIT_WIDTH_16BIT, channels == 1 ? I2S_SLOT_MODE_MONO : I2S_SLOT_MODE_STEREO)) {
            Serial.println("I2S start failed");
            return;
          }
          while (f.available()) {
            int n = f.read(chunk, sizeof(chunk));
            i2s.write(chunk, n);                                   // waits until queued
          }
          f.close();
          Serial.println("done");
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2S, Pin
        import struct

        PIN_BCLK, PIN_LRC, PIN_DOUT = 27, 25, 26

        f = open("clip.wav", "rb")
        hdr = f.read(44)                                           # the usual WAV header
        if hdr[0:4] != b"RIFF" or hdr[8:12] != b"WAVE":
            raise ValueError("not a WAV file")
        channels, rate, _, _, bits = struct.unpack("<HIIHH", hdr[22:36])
        print(rate, "Hz,", bits, "bit,", channels, "channel(s)")
        if bits != 16:
            raise ValueError("only 16-bit files")

        audio = I2S(0, sck=Pin(PIN_BCLK), ws=Pin(PIN_LRC), sd=Pin(PIN_DOUT),
                    mode=I2S.TX, bits=16, format=I2S.MONO if channels == 1 else I2S.STEREO,
                    rate=rate, ibuf=8000)
        chunk = bytearray(2048)
        view = memoryview(chunk)
        while True:
            n = f.readinto(chunk)
            if not n:
                break
            audio.write(view[:n])                                  # waits until queued
        f.close()
        audio.deinit()
        print("done")
      `,
      output: `
        16000 Hz, 16 bit, 1 channel(s)
        done
      `,
      notes: ['Convert a clip to the right format on a computer first (16 kHz, 16-bit, mono is small and clear for speech) and upload it to the file system.', 'A mono file in mono mode plays on the left slot only; the MAX98357A in its default mode mixes the two slots, so the sound comes out at half the level of a stereo file.', 'For MP3, use a decoding library such as ESP32-audioI2S (connecttoFS) instead of this loop; MicroPython\'s official builds have no MP3 decoder.']
    }
  ],
  formulas: [
    {
      name: 'How much sound a buffer holds',
      expr: 't = B/(fs*b/8*n)',
      tex: 't = \\frac{B}{f_s \\, (b/8) \\, n}',
      vars: {
        t: { name: 'time the buffer lasts', q: 'time', unit: 'ms' },
        B: { name: 'buffer size in bytes', value: 8192, min: 1 },
        fs: { name: 'sample rate', tex: 'f_s', q: 'frequency', unit: 'kHz', value: 16 },
        b: { name: 'bits per sample', value: 16, min: 8, max: 32, int: true },
        n: { name: 'channels', value: 1, min: 1, max: 8, int: true }
      },
      solveFor: 't',
      note: 'The time a full buffer of raw PCM can cover if the source stops completely. A compressed stream covers longer for the same bytes: divide by its bitrate instead.',
      stories: { t: 'A buffer of {B} bytes holds {n}-channel, {b}-bit audio at {fs}. How long can the source stall before the sound stops?', B: 'The source can stall for {t}. How many bytes of {n}-channel, {b}-bit audio at {fs} must the buffer hold?' },
      practice: { unknowns: ['t', 'B'] }
    }
  ],
  examples: [
    {
      title: 'A buffer for an SD card that pauses',
      q: 'Music is read from an SD card as 44.1 kHz, 16-bit stereo WAV. The card sometimes stalls for 250 ms. How big must the buffer be to ride that out?',
      steps: ['The stream needs $44\\,100 \\times 2 \\times 2 = 176\\,400$ bytes per second.', 'In 250 ms the player consumes $0.25 \\times 176\\,400 = 44\\,100$ bytes.', 'A buffer smaller than about 44 KB empties during the stall. Add a margin: 64 KB, which wants PSRAM on most chips.', 'At 128 kbit/s MP3 the same 250 ms needs only 4 KB of compressed data in front of the decoder (but the decoder\'s output buffer must still cover its own pauses).'],
      a: 'About 44 KB for raw CD-rate audio: 64 KB with margin. This is one reason to prefer MP3 or lower sample rates on small chips.'
    }
  ],
  quiz: [
    { q: 'A 16 kHz, 16-bit mono WAV file is played through an I2S bus opened as 16 kHz stereo, with the samples sent unchanged. What do you hear?', choices: ['Normal sound', 'Sound at half speed, an octave low', 'Sound at double speed', 'Silence'], a: 1, why: 'Each pair of consecutive mono samples is read as one left-right pair, so the clip lasts twice as long and sounds an octave lower.' },
    { q: 'Which makes a longer SD-card stall survivable?', choices: ['A higher baud rate', 'A bigger buffer in front of the I2S driver', 'A lower I2S bit depth only', 'A louder amplifier'], a: 1, why: 'The buffer holds audio that plays while the card is busy. Its length in milliseconds must exceed the longest stall.' },
    { q: 'The data of every WAV file starts exactly at byte 44.', a: false, why: 'The canonical header is 44 bytes, but many tools add chunks (such as LIST) before the data. A reliable player reads chunk by chunk until it finds the "data" chunk.' },
    { q: 'A minute of 128 kbit/s MP3 occupies about how much?', choices: ['96 KB', '960 KB', '9.6 MB', '96 MB'], a: 1, why: '128 kbit/s is 16 kB/s, so a minute is 960 KB; the same minute as 44.1 kHz stereo WAV is about 10.6 MB.' }
  ],
  applications: [
    'Voice prompts and sound effects in a doorbell, a talking clock or a toy.',
    'An MP3 player with buttons and a display, from an SD card.',
    'Alarms and announcements that play stored clips on an event.',
    'The first half of a networked player: the same chain with a network source instead of a file ([[internet-radio]]).'
  ],
  sources: [
    'Microsoft and IBM, *Multimedia Programming Interface and Data Specifications* (1991): the RIFF WAVE format.',
    'ISO/IEC 11172-3, MPEG-1 Audio (Layer III is MP3).',
    'The README files of the ESP32-audioI2S, ESP8266Audio and arduino-audio-tools libraries (supported formats and chips for the version you install).'
  ],
  sim: { id: 'au-buffer', params: { source: 'sd' } }
},

/* ================================================================ internet-radio */
{
  id: 'internet-radio',
  parent: 'audio',
  title: 'Internet radio',
  level: 2,
  short: 'A station is an HTTP request that never ends: the server keeps sending MP3 or AAC for as long as you keep reading. The ESP connects, buffers a few seconds, decodes and plays — and must survive Wi-Fi hiccups without a sound.',
  keywords: ['internet radio', 'web radio', 'Icecast', 'SHOUTcast', 'stream', 'ICY metadata', 'StreamTitle', 'MP3 stream', 'AAC', 'HLS', 'm3u', 'pls', 'buffer', 'ESP32-audioI2S', 'bitrate', 'Wi-Fi power save', 'PSRAM', 'HTTPS stream'],
  prereq: ['playing-audio-files', 'http-client', 'wifi-station'],
  related: ['audio-player-firmware', 'wifi-power-save-and-dtim', 'using-psram', 'https-and-tls', 'the-shared-radio', 'i2s-amplifiers-and-dacs'],
  body: `An internet radio station is, to the ESP, a very long download. The device sends an ordinary HTTP request to the address of the stream; the server answers and keeps answering, sending compressed audio at the stream's own speed for hours. Playing it is the file player of the previous page with the card replaced by a network socket, and the same rule: never be late.

### The chain

1. **Connect.** Wi-Fi up, then an HTTP request to the stream address. The reply is headers, then an endless body.
2. **Buffer.** Incoming bytes go into a RAM buffer of several seconds. The Wi-Fi link, the router, the internet and the station's server all hiccup; the buffer is what hides it.
3. **Decode.** MP3 or AAC back to samples, as in [[playing-audio-files]].
4. **Play.** Samples to I2S, to an amplifier or DAC ([[i2s-amplifiers-and-dacs]]).

### Numbers

| Stream | Data per second | Per hour |
|---|---|---|
| 64 kbit/s (speech, AAC) | 8 kB/s | 29 MB |
| 128 kbit/s (typical MP3) | 16 kB/s | 58 MB |
| 320 kbit/s (high-quality MP3) | 40 kB/s | 144 MB |

These are tiny for Wi-Fi, but the *steadiness* matters, not the speed. A buffer of 5 seconds of a 128 kbit/s stream is 80 kB: easy with PSRAM, tight on a chip without it, which is why a radio is happier on an ESP32 with PSRAM or on an S3.

### What can go wrong

- **Stutter.** Wi-Fi power saving makes the radio sleep between beacons and deliver data in bursts; turn it off for a player (\`WiFi.setSleep(false)\` in Arduino). Distance from the access point and a crowded channel have the same effect ([[wifi-power-save-and-dtim]]).
- **Starts, then stops after minutes.** The buffer slowly empties because the server sends a little slower than real time, or the connection dropped. A player must watch the buffer and reconnect.
- **No connection at all.** The address is a *playlist* (an .m3u or .pls file that points to the real stream) or an HLS stream, or the station uses HTTPS. Plain HTTP is simplest; TLS needs memory and processing time that compete with the decoder ([[https-and-tls]]).
- **Radio and Bluetooth together.** Both use the one 2.4 GHz radio of the chip ([[the-shared-radio]]); expect dropouts when they run together.

### Titles of the songs

Many stations interleave **metadata** into the stream when asked: the request carries a header saying so, and the server inserts a block with the current title every fixed number of bytes. Players show it as "now playing". It is optional, and a decoder that does not skip the blocks plays them as clicks.

> [!key] Internet radio is an endless HTTP download that is buffered, decoded and played. Use a stream URL on plain HTTP, buffer several seconds (PSRAM helps), switch Wi-Fi power saving off, and reconnect when the buffer runs low.`,
  ideas: [
    'A station is an HTTP request whose body never ends: the server streams compressed audio at its own steady rate.',
    'A RAM buffer of several seconds is what hides the hiccups of Wi-Fi, the router and the internet.',
    'Wi-Fi power saving delivers data in bursts and makes a stream stutter: turn it off in a player.',
    'The address people copy is often a playlist or an HTTPS or HLS stream; a simple player wants a direct HTTP MP3 or AAC address.'
  ],
  pitfalls: [
    'The station\'s web page address is the stream address — The page is HTML. The stream address is a separate link, often found in the station\'s "listen" or "apps" section, or inside a playlist file.',
    'A weak Wi-Fi signal only slows the start — It makes the buffer empty at random moments, heard as dropouts that seem to have no cause. Check the signal strength before blaming the software.',
    'HTTPS is as easy as HTTP — A TLS connection uses tens of kilobytes of RAM and CPU time while the decoder is running. Many small players stay on HTTP for the audio stream.'
  ],
  terms: [
    { term: 'Stream', also: ['audio stream', 'Icecast stream', 'SHOUTcast'], def: 'An HTTP connection over which a server sends compressed audio continuously. Icecast and SHOUTcast are the two common server programs.' },
    { term: 'ICY metadata', also: ['Shoutcast metadata', 'StreamTitle'], def: 'Titles inserted into the audio stream at a fixed byte interval when the client asks for them. A player strips them out and can show the name of the current song.' },
    { term: 'Playlist', also: ['.m3u', '.pls'], def: 'A small text file that lists one or more stream addresses. A player must fetch it and follow the address inside.' },
    { term: 'HLS', also: ['HTTP Live Streaming', '.m3u8'], def: 'A streaming method that sends audio as a series of short files named in a changing playlist. It needs a player that supports it; a plain MP3 stream does not use it.' },
    { term: 'Jitter', also: ['network jitter'], def: 'Variation in the arrival time of data. Audio buffers exist to absorb it.' }
  ],
  choose: {
    good: ['An ESP32 with PSRAM or an ESP32-S3 for a radio that must stay up for days', 'A direct plain-HTTP MP3 or AAC stream with a modest bitrate (64 to 128 kbit/s)', 'A library that handles playlists, metadata and reconnection'],
    avoid: ['A chip with no PSRAM and a long buffer', 'Running Bluetooth audio and the radio together', 'Leaving Wi-Fi power saving on'],
    check: ['That the address is a stream and not a web page or playlist', 'The signal strength where the player will sit', 'What happens when the stream drops: does it reconnect by itself?']
  },
  code: [
    {
      title: 'Play an internet radio station',
      about: 'Connects to Wi-Fi, turns Wi-Fi power saving off and plays an MP3 or AAC stream through an I2S amplifier. Put the address of a stream you are allowed to use in STREAM; the one below is a placeholder.',
      needs: 'An ESP32 with PSRAM (or an ESP32-S3), a MAX98357A and a speaker. Install the ESP32-audioI2S library, and choose Tools → Partition Scheme → Huge APP: with its decoders the program is about 1.9 MB, more than the 1.3 MB of the default scheme.',
      wiring: [['GPIO27', 'amplifier BCLK'], ['GPIO25', 'amplifier LRC'], ['GPIO26', 'amplifier DIN'], ['5V', 'amplifier VIN'], ['GND', 'amplifier GND']],
      libs: ['ESP32-audioI2S (schreibfaul1)'],
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          set Wi-Fi power saving [off v] :: wifi
          set audio output: BCLK (27) LRC (25) data (26), volume (10) of (21) :: sound
          play internet radio stream [http://radio.example.org/stream.mp3] :: sound
        forever
          keep the decoder fed :: sound
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <Audio.h>                                // the ESP32-audioI2S library

        const char *SSID = "your-ssid";                   // do not leave real credentials in shared code
        const char *PASS = "your-password";
        const char *STREAM = "http://radio.example.org/stream.mp3";   // an MP3 or AAC stream you may use

        Audio audio;

        void setup() {
          Serial.begin(115200);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          WiFi.setSleep(false);                           // power saving makes the stream stutter
          audio.setPinout(27, 25, 26);                    // BCLK, LRC, DOUT
          audio.setVolume(10);                            // 0 to 21
          audio.connecttohost(STREAM);                    // starts the request, buffering and decoding
        }

        void loop() {
          audio.loop();                                   // call it as often as possible: it moves the data
        }
      `,
      na: { py: 'MicroPython\'s official builds have no MP3 or AAC decoder, so they cannot play a compressed stream. A radio needs C++ (or a custom firmware with a decoder built in).' },
      output: `(the serial monitor may show the library's connection messages; the speaker plays the station)`,
      notes: ['Keep the loop free of delay(): audio.loop() must run many times a second or the sound breaks up.', 'The library\'s functions and examples differ between versions: follow the README of the one you install, and do not leave your Wi-Fi password in shared code ([[credentials-handling]]).', 'The library can also play a playlist address, send the title of the song to a callback and use HTTPS; see its examples.']
    }
  ],
  examples: [
    {
      title: 'How much buffer, and how much data?',
      q: 'A radio plays a 128 kbit/s stream and keeps 6 seconds of it in a buffer. How many bytes is the buffer, and how much data does an eight-hour day of listening transfer?',
      steps: ['128 kbit/s is $128\\,000 / 8 = 16\\,000$ bytes per second.', 'Six seconds are $6 \\times 16\\,000 = 96\\,000$ bytes: about 94 KiB of compressed audio.', 'Eight hours are $8 \\times 3600 \\times 16\\,000 = 460.8$ million bytes, about 460 MB.'],
      a: 'A 96 000-byte buffer (it fits comfortably in PSRAM) and about 460 MB of data for eight hours.'
    }
  ],
  quiz: [
    { q: 'A radio built on an ESP32 plays fine for a minute, then stutters, and does it more at the far end of the house. What is the first thing to try?', choices: ['A bigger speaker', 'Turn off Wi-Fi power saving and improve the signal', 'A lower I2S bit depth', 'A different amplifier'], a: 1, why: 'Power saving and a weak link both deliver data in late bursts. The buffer empties and the sound breaks. Fix the link first.' },
    { q: 'You paste the address of a station\'s web page into the player and get no sound. Why?', choices: ['The page is HTML, not an audio stream', 'The ESP cannot do HTTP', 'The volume is zero', 'The station needs Bluetooth'], a: 0, why: 'The page address returns a web page. The stream has its own address, often listed in a playlist file or the station\'s app links.' },
    { q: 'A 128 kbit/s stream needs a connection of at least a few megabits per second to play.', a: false, why: '128 kbit/s is a tiny rate for Wi-Fi. What matters is steadiness: the buffer must never run dry.' },
    { q: 'About how much data does one hour of a 128 kbit/s stream transfer?', choices: ['5.8 MB', '58 MB', '580 MB', '5.8 GB'], a: 1, why: '16 kB/s × 3600 s = 57.6 MB.' }
  ],
  applications: [
    'A kitchen or bathroom radio, with a rotary encoder for the volume and buttons for the favourite stations.',
    'A retro radio shell with a new ESP32 inside.',
    'A background-music node for a shop or workshop that restarts itself after a network failure.',
    'The audio half of a smart speaker ([[voice-assistants]]).'
  ],
  sources: [
    'Icecast project documentation and the SHOUTcast protocol notes: the metadata interval and in-stream titles.',
    'The README and examples of the ESP32-audioI2S library (formats, playlist and HTTPS support for the version you install).',
    'Arduino core for ESP32 documentation, *WiFi* API: power saving (core 3.3).'
  ],
  sim: { id: 'au-buffer', params: { source: 'network' } }
},

/* ================================================================ bluetooth-audio */
{
  id: 'bluetooth-audio',
  parent: 'audio',
  title: 'Bluetooth audio',
  level: 2,
  short: 'A Bluetooth speaker or a wireless transmitter on an ESP32: the A2DP profile, the SBC codec, and the facts that decide whether it is possible. Only the original ESP32 and the ESP32-S31 have the Classic radio it needs; LE-only chips cannot do it.',
  keywords: ['A2DP', 'Bluetooth speaker', 'A2DP sink', 'A2DP source', 'SBC', 'AVRCP', 'HFP', 'hands-free', 'ESP32-A2DP', 'Bluetooth Classic', 'latency', 'LE Audio', 'LC3', 'Auracast', 'headphones', 'transmitter', 'BluetoothA2DPSource'],
  prereq: ['bluetooth-classic-spp-and-a2dp', 'i2s-amplifiers-and-dacs', 'digital-audio-basics'],
  related: ['bluetooth-classic-and-le', 'ble-mesh-and-le-audio', 'the-shared-radio', 'partition-tables', 'soc-esp32', 'audio-player-firmware'],
  body: `Streaming music to a speaker over Bluetooth is not done with the Low Energy radio that most ESP chips have. It uses **Bluetooth Classic** and a profile called **A2DP**, the Advanced Audio Distribution Profile. That single fact decides most of what is possible, so check it first: among the microcontrollers only the original ESP32 and the ESP32-S31 (2026, preview software at the time of writing) carry the Classic radio. The ESP32-S3, C3, C6 and the rest cannot be a Bluetooth speaker or a transmitter, whatever else they do well. The next page of the series on radios explains the split: [[bluetooth-classic-and-le]].

### What travels

A2DP carries stereo audio, compressed with the **SBC** codec, which every A2DP device must support. SBC runs at roughly 230 to 330 kbit/s for 44.1 kHz stereo and adds a delay of a few tenths of a second once encoding, radio retransmissions and the receiver's own buffer are counted. Better codecs (AAC, aptX and others) exist between phones and headphones, but the ESP's stack offers SBC only. A companion profile, **AVRCP**, carries play, pause, next and volume commands. A third, **HFP**, the hands-free profile, carries telephone calls as narrow-band 8 kHz or wide-band 16 kHz speech.

### Two roles

- **Sink**: the ESP is the speaker. It receives SBC, decodes it to samples and sends them on I2S to a DAC or an amplifier ([[i2s-amplifiers-and-dacs]]). A phone sees "ESP32 speaker" in its Bluetooth list. The earlier page [[bluetooth-classic-spp-and-a2dp]] has this program.
- **Source**: the ESP is the transmitter. It produces samples (from a tone, a file, or an I2S microphone), encodes them and sends them to a speaker or headphones it has paired with. The program below makes a tone this way.

### Living with it

- **Latency.** A few tenths of a second is invisible for music and wrong for video unless the player compensates, and useless for a musical instrument.
- **Memory.** The Classic stack and the codec are big: choose a partition scheme with a large application area ([[partition-tables]]).
- **One radio.** Bluetooth and Wi-Fi share the 2.4 GHz radio ([[the-shared-radio]]). Streaming from Wi-Fi to a Bluetooth speaker at once is the classic recipe for dropouts; give the stream a buffer, or use a Wi-Fi radio on the sink side only.
- **Libraries.** The Arduino core ships only the serial profile. A2DP comes from the ESP32-A2DP library or from Espressif's ESP-IDF; the library changes with the core version, so follow its README.
- **The future.** LE Audio, with the LC3 codec and broadcast audio, is the Low Energy successor and would open this to LE-only chips; support in the ESP stack was still developing as of October 2026 ([[ble-mesh-and-le-audio]]).

> [!key] Bluetooth audio needs the Classic radio, so only the original ESP32 and the ESP32-S31 can be an A2DP speaker or transmitter. Expect SBC at 230 to 330 kbit/s, a delay of a few tenths of a second, a big program, and trouble if Wi-Fi runs at the same time.`,
  ideas: [
    'Music over Bluetooth uses the Classic profile A2DP, so the chip needs the Classic radio: the original ESP32 or the ESP32-S31.',
    'A sink receives and plays (a speaker); a source creates and sends (a transmitter); AVRCP carries the remote controls, HFP the phone calls.',
    'A2DP on an ESP uses the SBC codec at about 230 to 330 kbit/s and adds a delay of a few tenths of a second.',
    'It needs a large program partition and fights with Wi-Fi for the shared radio.'
  ],
  pitfalls: [
    'My ESP32-S3 has Bluetooth 5, so it can be a Bluetooth speaker — Speaker audio travels over Classic, which the S3 does not have. Bluetooth 5 on those chips is Low Energy only.',
    'The delay can be removed in software — Most of it is the codec, the retransmission and the receiver\'s own buffer. Choose another way (a wire, or a Wi-Fi link with its own protocol) if sound and picture or an instrument must be in sync.',
    'It works on the bench, so it works with Wi-Fi on — Both radios compete for the same antenna time. The stream drops out when the ESP also serves web pages or uploads data.'
  ],
  terms: [
    { term: 'A2DP', also: ['Advanced Audio Distribution Profile', 'Bluetooth audio'], def: 'The Classic Bluetooth profile for streaming stereo music in one direction, from a source (a phone) to a sink (a speaker).' },
    { term: 'SBC', also: ['sub-band codec'], def: 'The compression format every A2DP device supports. On an ESP it runs at about 230 to 330 kbit/s for 44.1 kHz stereo.' },
    { term: 'AVRCP', also: ['Audio/Video Remote Control Profile'], def: 'The profile that sends play, pause, next and volume commands between a Bluetooth speaker or headset and its source.' },
    { term: 'HFP', also: ['Hands-Free Profile', 'headset profile'], def: 'The profile for telephone calls: two-way speech at 8 kHz (narrow-band) or 16 kHz (wide-band) between a phone and a headset.' },
    { term: 'LE Audio', also: ['LC3', 'Auracast'], def: 'The audio system of Bluetooth Low Energy, with the LC3 codec and broadcast streams. It is the successor of A2DP for LE-only chips; ESP support was still developing in October 2026.' }
  ],
  choose: {
    good: ['An original ESP32 with an I2S DAC as a hobby Bluetooth speaker', 'An ESP32 as a transmitter that sends a line-in or a tone to existing wireless headphones', 'A project where a delay of a few tenths of a second does not matter'],
    avoid: ['Any ESP32-S3, C3, C6 or other LE-only chip for A2DP', 'Streaming over Wi-Fi and Bluetooth at the same time on one chip', 'Anything that must stay in sync with video or play live music'],
    check: ['That the chip has Bluetooth Classic (the chip pages and the explorer say)', 'The partition scheme and the size of the sketch', 'Which library version works with your Arduino core version']
  },
  code: [
    {
      title: 'Send a tone to a Bluetooth speaker',
      about: 'The ESP is an A2DP source: it looks for a speaker called "MySpeaker", pairs with it and sends a quiet 440 Hz tone, computed on demand in a callback the library calls whenever it needs more sound.',
      needs: 'An original ESP32 board, a Bluetooth speaker in pairing mode (rename the string to its name), and a partition scheme with a large application area. Install the ESP32-A2DP library.',
      libs: ['ESP32-A2DP (pschatzmann)'],
      blocks: `
        when started
          start Bluetooth audio source, connect to speaker [MySpeaker] :: ble
          set Bluetooth audio volume (30) :: ble

        when audio data is needed (frames) :: sound
          fill the frames with a 440 Hz sine, amplitude 6000, 44.1 kHz stereo :: sound
      `,
      cpp: String.raw`
        #include "BluetoothA2DPSource.h"
        #include <math.h>

        BluetoothA2DPSource a2dp_source;

        const float FREQ = 440.0;                  // the tone, in Hz
        const float AMPLITUDE = 6000.0;            // out of 32767: keep it quiet

        // The library calls this whenever it needs sound: fill frame_count stereo frames.
        int32_t get_data_frames(Frame *frame, int32_t frame_count) {
          static float phase = 0.0;
          const float step = 2.0 * PI * FREQ / 44100.0;   // A2DP audio is 44.1 kHz stereo
          for (int i = 0; i < frame_count; i++) {
            int16_t s = (int16_t)(AMPLITUDE * sin(phase));
            frame[i].channel1 = s;                 // left
            frame[i].channel2 = s;                 // right
            phase += step;
            if (phase > 2.0 * PI) phase -= 2.0 * PI;
          }
          return frame_count;
        }

        void setup() {
          a2dp_source.set_volume(30);                     // 0 to 127
          a2dp_source.start("MySpeaker", get_data_frames);   // the name of the speaker to connect to
        }

        void loop() {
          delay(1000);
        }
      `,
      na: { py: 'MicroPython has no Bluetooth Classic and no A2DP: its bluetooth module is Low Energy only. For an LE-only chip, wait for LE Audio support ([[ble-mesh-and-le-audio]]).' },
      output: `(nothing on the serial port) Once the speaker is in pairing mode the ESP connects, and a quiet 440 Hz tone plays until power is removed.`,
      notes: ['The name in start() is the speaker to look for, not a name for the ESP. Put the speaker in pairing mode the first time; later it reconnects by itself.', 'The library and its calls have changed between versions, and between Arduino core 2 and 3: the Frame type, the volume range and the callback form shown here are those of the library\'s own example. Follow the README of the version you install.', 'Do not run Wi-Fi at the same time while streaming: the shared radio causes dropouts ([[the-shared-radio]]).']
    }
  ],
  examples: [
    {
      title: 'How much radio does the stream take?',
      q: 'An A2DP link carries SBC at 328 kbit/s for 44.1 kHz stereo. By what factor is the audio compressed, and how many kilobytes of SBC per second does the ESP encode?',
      steps: ['Raw stereo at 44.1 kHz and 16 bits is $44\\,100 \\times 16 \\times 2 = 1\\,411\\,200$ bit/s.', 'The compression factor is $1\\,411\\,200 / 328\\,000 \\approx 4.3$.', 'The SBC stream is $328 / 8 = 41$ kB per second.'],
      a: 'About 4.3 times smaller than raw PCM, at 41 kB per second. The encoder must keep up in real time while the radio also sends and retransmits.'
    }
  ],
  quiz: [
    { q: 'Which chip can be a Bluetooth stereo speaker for a phone?', choices: ['ESP32-S3', 'ESP32-C3', 'Original ESP32', 'ESP32-C6'], a: 2, why: 'A2DP needs Bluetooth Classic. Of these only the original ESP32 has it; the S3, C3 and C6 are Low Energy only.' },
    { q: 'In an A2DP link, the phone playing music is the…', choices: ['sink', 'source', 'server', 'gateway'], a: 1, why: 'The source creates and sends the audio; the sink (the speaker) receives and plays it. An ESP can be either.' },
    { q: 'The delay of a Bluetooth speaker can be removed by a faster sample rate.', a: false, why: 'The delay comes from encoding, retransmission and the receiver\'s buffers, a few tenths of a second whatever the rate.' },
    { q: 'An A2DP sketch fails to upload with a "does not fit" message. What do you change?', choices: ['The baud rate', 'The partition scheme, to one with a big application area', 'The I2S pins', 'The volume'], a: 1, why: 'The Classic stack and the codec make a large program; a "Huge APP" style scheme gives it room.' }
  ],
  applications: [
    'A hobby Bluetooth speaker, or an old stereo made wireless with an ESP32 and a DAC.',
    'A transmitter that sends the sound of a television or a turntable to wireless headphones.',
    'A hands-free kit or intercom that connects to a phone.',
    'A tone or announcement sent to a paired speaker by a small appliance.'
  ],
  sources: [
    'Bluetooth SIG, *Advanced Audio Distribution Profile (A2DP)* and *Audio/Video Remote Control Profile (AVRCP)* specifications; *Hands-Free Profile (HFP)*.',
    'Espressif, *ESP-IDF Programming Guide*, Classic Bluetooth: A2DP and HFP APIs.',
    'The README and examples of the ESP32-A2DP library (the source and sink examples for the version you install).'
  ]
},

/* ================================================================ fft-and-spectrum */
{
  id: 'fft-and-spectrum',
  parent: 'audio',
  title: 'The FFT and the spectrum',
  level: 3,
  short: 'The fast Fourier transform turns a block of samples into the strengths of the frequencies in it: a spectrum. The window, the number of samples and the sample rate decide what you can see in it, and what you cannot.',
  keywords: ['FFT', 'spectrum', 'Fourier', 'frequency bins', 'window', 'Hann', 'Hamming', 'leakage', 'resolution', 'Goertzel', 'ESP-DSP', 'arduinoFFT', 'spectrum analyser', 'tuner', 'vibration', 'DTMF', 'magnitude', 'bin width'],
  prereq: ['digital-audio-basics', 'i2s-microphones', 'electronics:spectrum-harmonics'],
  related: ['wake-words-and-speech-commands', 'esp-as-an-oscilloscope', 'anomaly-detection', 'motion-sensors-imu', 'electronics:filters', 'math:fourier-series'],
  body: `Any sound is a sum of pure tones. A spectrum says how strong each tone is: a flute is one tall peak, a voice a comb of peaks, a hiss a low even carpet. Computers get a spectrum with the **fast Fourier transform** (FFT): feed it $N$ samples and it returns $N/2$ numbers, the strength in each of $N/2$ frequency slots called **bins**. It does in $N \\log_2 N$ steps what the plain definition does in $N^2$, which is why 1 024 samples are a quick job for an ESP32.

### What the numbers mean

Bin $k$ holds the strength near $k \\, f_s / N$ hertz. So the bins are spaced $f_s / N$ apart, the **frequency resolution**, and they run from 0 up to the Nyquist frequency $f_s/2$. At 16 kHz with $N = 512$ the bins are 31.25 Hz wide and the highest is 8 kHz. The block lasts $N / f_s$ seconds (32 ms here), and that is the catch: **sharper frequency means a longer block**, and a longer block cannot say *when* inside it a sound happened. To tell two notes a semitone apart near 100 Hz needs bins of a few hertz, so a block of a quarter of a second or more.

### The window

The FFT acts as if the block repeated for ever. A tone that does not fit a whole number of cycles in the block makes a jump at the seam, and the jump spreads that tone's energy across many bins: **leakage**. A **window** (Hann and Hamming are the usual) fades the block's edges to zero before the transform. Leakage drops sharply, at the price of a slightly wider peak. The second simulation lets you see both. Use a window for any measurement; skip it only for a signal known to fit the block exactly.

### On the ESP

Write a small FFT yourself to learn it (the program below), then use a library: *arduinoFFT* is easy, and Espressif's **ESP-DSP** library has fast FFTs for every chip, using the vector instructions of the ESP32-S3. A few habits matter: sample at a steady rate (an irregular loop smears the spectrum), remove the DC offset first (or bin 0 swamps the rest), and take the magnitude of each bin, $\\sqrt{re^2 + im^2}$, optionally in decibels. To watch one tone only — a DTMF key, a 38 kHz carrier, a single alarm pitch — the **Goertzel** algorithm computes just that bin with far less work.

> [!key] An FFT turns N samples into N/2 bins of width fs/N. Better frequency resolution needs a longer block, a window tames leakage, and a steady sample rate and no DC offset keep the spectrum clean.`,
  ideas: [
    'An FFT turns a block of N samples into N/2 frequency bins spaced fs/N apart, from 0 to the Nyquist frequency.',
    'Sharper frequency resolution needs a longer block, so it blurs when things happen: the two cannot both be sharp.',
    'A tone that does not fit the block leaks into neighbouring bins; a window such as Hann reduces that at the cost of a wider peak.',
    'Sample at a steady rate and remove the DC offset; to watch a single tone, the Goertzel algorithm is much cheaper than a full FFT.'
  ],
  pitfalls: [
    'The peak bin is the exact frequency of the tone — It is the nearest bin, off by up to half a bin width. A 440 Hz tone with 31.25 Hz bins shows at 437.5 Hz; interpolating between neighbours gives a better estimate.',
    'A longer FFT improves everything — It sharpens frequency and blurs time, and costs more RAM and processing. Match the block length to what must be resolved.',
    'Windowing is optional polish — Without it a tone that does not fit the block spreads over many bins and hides weaker tones next to it.'
  ],
  terms: [
    { term: 'FFT', also: ['fast Fourier transform', 'DFT'], def: 'An efficient algorithm that turns N samples of a signal into the strengths and phases of N/2 frequencies. N is normally a power of two.' },
    { term: 'Bin', also: ['frequency bin'], def: 'One slot of an FFT result. Bin k represents the frequency k × fs / N; its width is fs / N.' },
    { term: 'Window function', also: ['Hann window', 'Hamming window'], def: 'A smooth curve, near zero at both ends, by which the block is multiplied before the transform to reduce leakage.' },
    { term: 'Spectral leakage', also: ['leakage'], def: 'The spreading of a tone\'s energy over neighbouring bins when the block does not contain a whole number of its cycles.' },
    { term: 'Goertzel algorithm', also: ['Goertzel filter'], def: 'A method that computes the strength of a single frequency from a block of samples at a fraction of the cost of a full FFT. Used for DTMF and tone detection.' },
    { term: 'Frequency resolution', also: ['bin width', 'df'], def: 'The spacing of the bins: sample rate divided by block length. Two tones closer than this blur into one peak.' }
  ],
  choose: {
    good: ['A 512- or 1 024-point FFT at 16 kHz with a Hann window for audio spectra and level bars', 'ESP-DSP for speed, especially on the ESP32-S3', 'Goertzel for a handful of known tones (DTMF, alarm pitches)'],
    avoid: ['Irregular sampling from a loop with delays in it', 'A block so long that the answer arrives seconds late', 'Reading the exact pitch from the peak bin without interpolation'],
    check: ['The bin width fs / N against the detail you need', 'That the block length fits in RAM (floats take 4 bytes, and the transform needs real and imaginary parts)', 'That the DC offset is removed before the transform']
  },
  code: [
    {
      title: 'Find the tones in a signal, with an FFT you can read',
      about: 'Builds 256 samples of a mixture of a 440 Hz tone (amplitude 1) and a 1 000 Hz tone (amplitude 0.5) at 8 kHz, runs a plain radix-2 FFT, and prints the bins that are clearly above the floor. Replace the first loop with readings from a microphone to analyse real sound.',
      needs: 'Any ESP board and the serial monitor at 115200 baud. No extra hardware.',
      blocks: `
        when started
          start serial at (115200) baud
          set [n v] to (256)
          set [fs v] to (8000)
          for each [i v] in (0 to 255)
            set item (i) of [re v] to ((sine of (2 * 3.14159 * 440 * (i) / (fs))) + (0.5 * (sine of (2 * 3.14159 * 1000 * (i) / (fs)))))
            set item (i) of [im v] to (0)
          end
          fast Fourier transform of [re v] and [im v], in place :: my
          print (join [bin width ] ((fs) / (n)) [ Hz])
          for each [k v] in (1 to 127)
            set [mag v] to (((square root of (((item (k) of [re v]) * (item (k) of [re v])) + ((item (k) of [im v]) * (item (k) of [im v])))) * 2) / (n))
            if <(mag) > (0.2)> then
              print (join [bin ] (k) [  ] ((k) * (fs) / (n)) [ Hz  ] (mag))
            end
          end
      `,
      cpp: String.raw`
        const int N = 256;                       // samples: a power of two
        const float FS = 8000.0;                 // sample rate in Hz
        float re[N], im[N];

        void fft() {                             // in place, radix-2, decimation in time
          for (int i = 1, j = 0; i < N; i++) {   // put the samples in bit-reversed order
            int bit = N >> 1;
            for (; j & bit; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) { float t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
          }
          for (int len = 2; len <= N; len <<= 1) {      // combine pairs, then fours, then eights ...
            float ang = -2 * PI / len;
            for (int i = 0; i < N; i += len) {
              for (int k = 0; k < len / 2; k++) {
                float wr = cos(ang * k), wi = sin(ang * k);
                int a = i + k, b = i + k + len / 2;
                float xr = re[b] * wr - im[b] * wi, xi = re[b] * wi + im[b] * wr;
                re[b] = re[a] - xr;  im[b] = im[a] - xi;
                re[a] += xr;         im[a] += xi;
              }
            }
          }
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          for (int n = 0; n < N; n++) {          // 440 Hz at 1.0 plus 1000 Hz at 0.5
            re[n] = sin(2 * PI * 440 * n / FS) + 0.5 * sin(2 * PI * 1000 * n / FS);
            im[n] = 0;
          }
          fft();
          Serial.printf("bin width %.2f Hz\n", FS / N);
          for (int k = 1; k < N / 2; k++) {
            float mag = sqrt(re[k] * re[k] + im[k] * im[k]) * 2 / N;   // scaled so a unit sine reads about 1
            if (mag > 0.2) Serial.printf("bin %d  %.1f Hz  %.2f\n", k, k * FS / N, mag);
          }
        }

        void loop() {}
      `,
      py: String.raw`
        import math

        N = 256                                  # samples: a power of two
        FS = 8000.0                              # sample rate in Hz
        re = [math.sin(2 * math.pi * 440 * n / FS) + 0.5 * math.sin(2 * math.pi * 1000 * n / FS) for n in range(N)]
        im = [0.0] * N                           # 440 Hz at 1.0 plus 1000 Hz at 0.5

        def fft():                               # in place, radix-2, decimation in time
            j = 0
            for i in range(1, N):                # put the samples in bit-reversed order
                bit = N >> 1
                while j & bit:
                    j ^= bit
                    bit >>= 1
                j ^= bit
                if i < j:
                    re[i], re[j] = re[j], re[i]
                    im[i], im[j] = im[j], im[i]
            length = 2
            while length <= N:                   # combine pairs, then fours, then eights ...
                ang = -2 * math.pi / length
                for i in range(0, N, length):
                    for k in range(length // 2):
                        wr, wi = math.cos(ang * k), math.sin(ang * k)
                        a, b = i + k, i + k + length // 2
                        xr = re[b] * wr - im[b] * wi
                        xi = re[b] * wi + im[b] * wr
                        re[b], im[b] = re[a] - xr, im[a] - xi
                        re[a], im[a] = re[a] + xr, im[a] + xi
                length <<= 1

        fft()
        print("bin width %.2f Hz" % (FS / N))
        for k in range(1, N // 2):
            mag = math.sqrt(re[k] * re[k] + im[k] * im[k]) * 2 / N    # scaled so a unit sine reads about 1
            if mag > 0.2:
                print("bin %d  %.1f Hz  %.2f" % (k, k * FS / N, mag))
      `,
      output: `
        bin width 31.25 Hz
        bin 14  437.5 Hz  0.99
        bin 32  1000.0 Hz  0.49
      `,
      notes: ['The 1 000 Hz tone fits the block exactly (bin 32) and reads 0.49; the 440 Hz tone falls between bins 14 and 15, is shown at the nearer one (437.5 Hz) and loses a little height.', 'No window is applied here, on purpose: add one (multiply each sample by 0.5 − 0.5 cos(2πn / (N − 1))) and the 440 Hz peak becomes wider but cleaner.', 'In MicroPython the transform of 256 points takes tens of milliseconds; for real-time audio use C++ with ESP-DSP or arduinoFFT.']
    }
  ],
  formulas: [
    {
      name: 'Frequency resolution of an FFT',
      expr: 'df = fs/N',
      tex: '\\Delta f = \\frac{f_s}{N}',
      vars: {
        df: { name: 'bin width (frequency resolution)', tex: '\\Delta f', q: 'frequency', unit: 'Hz' },
        fs: { name: 'sample rate', tex: 'f_s', q: 'frequency', unit: 'kHz', value: 16 },
        N: { name: 'samples in the block', value: 512, min: 2, int: true }
      },
      solveFor: 'df',
      note: 'The same number is the reciprocal of the block\'s duration: a block of T seconds resolves 1/T hertz. Halving the bin width needs a block twice as long.',
      stories: { df: 'A microphone is sampled at {fs} and analysed in blocks of {N} samples. How wide is each frequency bin?', N: 'A spectrum at {fs} must have bins {df} wide. How many samples must each block hold?' },
      practice: { unknowns: ['df', 'N'] }
    },
    {
      name: 'Frequency of a bin',
      expr: 'f = k*fs/N',
      tex: 'f_k = \\frac{k \\, f_s}{N}',
      vars: {
        f: { name: 'frequency of bin k', tex: 'f_k', q: 'frequency', unit: 'Hz' },
        k: { name: 'bin number (0 is DC)', value: 14, min: 0, int: true },
        fs: { name: 'sample rate', tex: 'f_s', q: 'frequency', unit: 'kHz', value: 8 },
        N: { name: 'samples in the block', value: 256, min: 2, int: true }
      },
      solveFor: 'f',
      note: 'Valid for bins 0 to N/2. The true frequency of a tone is within half a bin of the peak bin; interpolating between neighbours narrows the error.',
      stories: { f: 'In a {N}-point FFT at {fs}, which frequency does bin {k} represent?', k: 'A tone of {f} is analysed at {fs} with {N} points. Which bin shows its peak?' },
      practice: { unknowns: ['f', 'k'] }
    }
  ],
  examples: [
    {
      title: 'Can a tuner tell E2 from F2 with one block?',
      q: 'A guitar tuner samples at 8 kHz. The low E string is 82.4 Hz and the F above it 87.3 Hz. How many samples must the block hold to place them in different bins, and how long is that block?',
      steps: ['The two notes are $87.3 - 82.4 = 4.9$ Hz apart, so the bins must be narrower than about 4.9 Hz, better 2 to 3 Hz to see two peaks.', 'For 2.5 Hz bins at 8 kHz: $N = f_s / \\Delta f = 8000 / 2.5 = 3200$, so a block of 4 096 (a power of two) gives 1.95 Hz bins.', 'Its duration is $4096 / 8000 = 0.51$ s.', 'A cheaper route: decimate to 2 kHz first and use $N = 1024$ — the same 1.95 Hz bins from a quarter of the sample memory.'],
      a: 'About 4 096 samples at 8 kHz, a block of about half a second. Lowering the sample rate to what the task needs gives the same resolution with less memory.'
    }
  ],
  quiz: [
    { q: 'An FFT of 1 024 points on a signal sampled at 16 kHz. How wide is each bin?', choices: ['1 Hz', '15.6 Hz', '31.25 Hz', '62.5 Hz'], a: 1, why: 'Bin width = fs / N = 16 000 / 1 024 = 15.6 Hz.' },
    { q: 'To halve the bin width without changing the sample rate you must…', choices: ['Halve the block length', 'Double the block length', 'Double the amplitude', 'Use a Hann window'], a: 1, why: 'Bin width is fs / N. Doubling N halves it, at the price of a block that lasts twice as long.' },
    { q: 'A tone at 440 Hz shows its peak at 437.5 Hz in a spectrum with 31.25 Hz bins. The microphone is out of tune.', a: false, why: 'The peak lies at the nearest bin; the true frequency is within half a bin (15.6 Hz) of it. Interpolating between neighbouring bins gives a better estimate.' },
    { q: 'What does a window function such as Hann do?', choices: ['Raises the sample rate', 'Fades the edges of the block to reduce leakage', 'Removes the DC offset', 'Makes the FFT faster'], a: 1, why: 'Multiplying the block by a curve that is zero at both ends removes the jump at the seam, which is what spreads a tone over neighbouring bins.' }
  ],
  applications: [
    'Spectrum bars on an LED matrix or a display that dance to music.',
    'Tuners, whistle and alarm detection, and the first stage of audio classifiers ([[keyword-spotting]]).',
    'Vibration monitoring of a motor or a pump from an accelerometer: the frequency of the peaks identifies the fault ([[anomaly-detection]]).',
    'Decoding tones: DTMF keypads, a 38 kHz carrier, an ultrasonic echo.'
  ],
  sources: [
    'James W. Cooley and John W. Tukey, "An algorithm for the machine calculation of complex Fourier series", 1965.',
    'Espressif, *ESP-DSP* library documentation: FFT functions and benchmarks.',
    'Fredric J. Harris, "On the use of windows for harmonic analysis with the discrete Fourier transform", Proceedings of the IEEE, 1978.'
  ],
  sim: 'au-spectrum'
},

/* ================================================================ wake-words-and-speech-commands */
{
  id: 'wake-words-and-speech-commands',
  parent: 'audio',
  title: 'Wake words and speech commands',
  level: 3,
  short: 'A device that listens all the time cannot send everything to a server. A small model on the chip waits for one phrase, and only then are commands recognised. The pipeline from microphone to action, what runs on an ESP32-S3, and the two errors every detector trades off.',
  keywords: ['wake word', 'WakeNet', 'MultiNet', 'ESP-SR', 'microWakeWord', 'voice activity detection', 'VAD', 'AFE', 'echo cancellation', 'noise suppression', 'beamforming', 'speech commands', 'keyword spotting', 'false accept', 'false reject', 'always listening', 'offline voice control'],
  prereq: ['i2s-microphones', 'fft-and-spectrum', 'audio-codecs'],
  related: ['voice-assistants', 'keyword-spotting', 'ai-accelerators-s3-and-p4', 'what-fits-in-a-microcontroller', 'cameras-and-the-law', 'esp32-s3-box', 'project-voice-lamp'],
  body: `A smart speaker listens every second of the day, yet almost nothing it hears leaves the room. The trick is a staircase of detectors, each cheap enough to run all the time and each waking the next only when it hears something worth the effort.

### The stages

1. **Microphone and front end.** One or several microphones feed an *audio front end*: echo cancellation (subtract what the speaker itself is playing), noise suppression, beam-forming with two or more microphones to favour the speaker's direction, automatic gain, and **voice activity detection**, the simplest test of all, which asks only whether this block is louder than the room and shaped like speech.
2. **Wake-word detector.** A small neural network, a few hundred kilobytes, that does one thing: say whether the last second contained the phrase ("Hi ESP" or another from its list). It runs continuously, so it must be frugal. A wrong *yes* is a **false accept** (the lamp lights at the television); a wrong *no* is a **false reject** (you shout twice). Raising the threshold trades one for the other, and no setting removes both.
3. **Command recogniser.** Once awake, a larger model matches what follows against a short list of commands ("turn on the light", "set a timer"), entirely on the device. No network is involved, and it answers in a fraction of a second, but only for phrases on the list.
4. **Everything else.** Free speech goes to a server ([[voice-assistants]]).

### What runs on which chip

Espressif's speech library, ESP-SR, provides the front end, a wake-word engine (WakeNet) and a command engine (MultiNet), and targets the **ESP32-S3** and the **ESP32-P4**: both have the vector instructions and the PSRAM the models need. The ESP32-S3-BOX-3, the Korvo boards and the ESP-VoCat are built for it, and the Arduino core has a wrapper library for the S3. ESPHome carries a community wake-word system, *microWakeWord*, built on TensorFlow Lite for Microcontrollers ([[tflite-micro-and-esp-dl]]). Chips without those resources, the C3 and the C6, can do the voice-activity stage and little more: they are the ones that stream audio away after a button press instead.

### Limits to expect

- **Noise and distance.** Accuracy falls with background noise, reverberation and distance; the microphone array and echo cancellation exist to fight it.
- **Accents and languages.** A model hears best the voices and languages it was trained on; check what a library ships.
- **Privacy.** A device that listens records people. Wake-word processing on the device is a real protection, because audio leaves the unit only afterwards; still tell the people near it ([[cameras-and-the-law]]).

> [!key] Voice control is a staircase of cheap detectors: voice activity, then a wake word on the device, then a short list of commands on the device, and only then the network. The ESP32-S3 and P4 have the speed and memory for it; the thresholds trade false accepts against false rejects.`,
  ideas: [
    'Always-on listening is made affordable by a staircase: a very cheap voice-activity test, then a small wake-word model, then a command recogniser.',
    'The wake-word detector trades false accepts against false rejects; lowering one raises the other.',
    'Espressif\'s ESP-SR front end, WakeNet and MultiNet run on the ESP32-S3 and ESP32-P4, which have the vector instructions and PSRAM they need.',
    'Wake-word detection on the device keeps audio inside the unit until after the phrase is heard; people near the device must still be told.'
  ],
  pitfalls: [
    'Any ESP32 can run a wake-word model — The models need RAM, PSRAM and processing power that the S3 and P4 offer. Small single-core chips can detect that someone is speaking, not what.',
    'A wake-word detector is just a loudness switch — A loudness test (voice activity detection) is its first stage. The wake word itself is a neural network that recognises a particular phrase and ignores other loud sounds.',
    'On-device wake word means nothing is ever recorded — The device hears everything locally. What is sent away, and whether it is stored, is a separate design choice that you must state.'
  ],
  terms: [
    { term: 'Wake word', also: ['hot word', 'trigger phrase'], def: 'A short phrase that a device listens for all the time, and which switches on the rest of the speech system when heard.' },
    { term: 'Voice activity detection', also: ['VAD'], def: 'A simple test of whether a block of audio contains speech rather than silence or noise. It is the cheapest stage, and often the first.' },
    { term: 'False accept', also: ['false alarm', 'false positive'], def: 'The detector fires when the phrase was not spoken. Measured as events per hour of audio.' },
    { term: 'False reject', also: ['miss', 'false negative'], def: 'The detector fails to fire when the phrase was spoken. Measured as a percentage of utterances.' },
    { term: 'Audio front end', also: ['AFE'], def: 'The processing between the microphones and the recogniser: echo cancellation, noise suppression, beam-forming and gain control.' },
    { term: 'ESP-SR', also: ['WakeNet', 'MultiNet'], def: 'Espressif\'s speech recognition framework for the ESP32-S3 and ESP32-P4: WakeNet detects the wake word and MultiNet recognises a list of commands, both on the chip.' }
  ],
  choose: {
    good: ['An ESP32-S3 or ESP32-P4 board with a microphone array and PSRAM for on-device wake word and commands', 'A fixed list of ten or twenty commands for a lamp, a fan or a timer', 'Wake word on the device and everything else on your own server'],
    avoid: ['A C3 or C6 as the wake-word device', 'Open-ended speech recognised on the chip', 'A threshold chosen once in a quiet room and never tested in a noisy one'],
    check: ['The languages, wake words and commands the library actually ships', 'The false-accept rate in the room where the device will stand', 'RAM, PSRAM and the partition size left after the models']
  },
  code: [
    {
      title: 'A sound-activated light: the first stage of every voice chain',
      about: 'Measures the loudness of 20 ms blocks from an I2S microphone, learns the background level from the quiet blocks, and lights the LED when a block is three times louder than that background. It stays on for one second after the last loud block. This is voice-activity detection by energy: it hears speech, a clap or a slammed door alike, and recognises nothing.',
      needs: 'An ESP32 DevKit, an INMP441-type I2S microphone (L/R to GND) and the board\'s LED on GPIO2.',
      wiring: [['GPIO32', 'microphone SCK'], ['GPIO25', 'microphone WS'], ['GPIO33', 'microphone SD'], ['GPIO2', 'LED', 'on-board, or 220 Ω to an LED to GND']],
      blocks: `
        when started
          set pin (2) as [output v]
          start I2S input: BCLK (32) WS (25) data (33) at (16000) Hz, 32 bit mono, left slot :: sound
          set [background v] to (2000)
          set [last loud v] to (0)
          set [on v] to <false>
        forever
          set [level v] to (loudness of (read (320) samples from I2S :: sound), offset removed)
          if <(level) > ((3) * (background))> then
            set [last loud v] to (milliseconds since start)
            set [on v] to <true>
          else
            change [background v] by ((0.01) * ((level) - (background)))
            if <((milliseconds since start) - (last loud)) > (1000)> then
              set [on v] to <false>
            end
          end
          set pin (2) to (on)
        end
      `,
      cpp: String.raw`
        #include <ESP_I2S.h>

        I2SClass i2s;

        const int PIN_BCLK = 32, PIN_WS = 25, PIN_DIN = 33;   // I2S microphone, L/R tied to GND
        const int LED = 2;
        const int N = 320;                          // 20 ms at 16 kHz
        const float RATIO = 3.0;                    // speech must be three times the background
        const uint32_t HANG_MS = 1000;              // stay on this long after the last loud block
        int32_t buf[N];
        float background = 2000;                    // running estimate of the quiet level
        uint32_t lastLoud = 0;
        bool on = false;

        void setup() {
          pinMode(LED, OUTPUT);
          i2s.setPins(PIN_BCLK, PIN_WS, -1, PIN_DIN);
          if (!i2s.begin(I2S_MODE_STD, 16000, I2S_DATA_BIT_WIDTH_32BIT, I2S_SLOT_MODE_MONO)) while (true) delay(1000);
        }

        void loop() {
          size_t got = i2s.readBytes((char *)buf, sizeof(buf)) / sizeof(int32_t);
          if (got == 0) return;
          double mean = 0, sum = 0;
          for (size_t i = 0; i < got; i++) mean += buf[i] >> 8;
          mean /= got;                              // the DC offset
          for (size_t i = 0; i < got; i++) { double s = (buf[i] >> 8) - mean; sum += s * s; }
          float level = sqrt(sum / got);            // rms of this block

          if (level > RATIO * background) {
            lastLoud = millis();
            on = true;
          } else {
            background += 0.01 * (level - background);   // learn the background from quiet blocks only
            if (millis() - lastLoud > HANG_MS) on = false;
          }
          digitalWrite(LED, on);
        }
      `,
      py: String.raw`
        from machine import I2S, Pin
        import array, math, time

        PIN_BCLK, PIN_WS, PIN_DIN = 32, 25, 33      # I2S microphone, L/R tied to GND
        led = Pin(2, Pin.OUT)
        N = 320                                     # 20 ms at 16 kHz
        RATIO = 3.0                                 # speech must be three times the background
        HANG_MS = 1000                              # stay on this long after the last loud block

        mic = I2S(0, sck=Pin(PIN_BCLK), ws=Pin(PIN_WS), sd=Pin(PIN_DIN),
                  mode=I2S.RX, bits=32, format=I2S.MONO, rate=16000, ibuf=8192)
        buf = array.array("i", [0] * N)
        background = 2000.0                         # running estimate of the quiet level
        last_loud = time.ticks_ms()
        on = False

        while True:
            got = mic.readinto(buf) // 4
            if got == 0:
                continue
            mean = sum(buf[i] >> 8 for i in range(got)) / got        # the DC offset
            total = sum(((buf[i] >> 8) - mean) ** 2 for i in range(got))
            level = math.sqrt(total / got)                           # rms of this block

            if level > RATIO * background:
                last_loud = time.ticks_ms()
                on = True
            else:
                background += 0.01 * (level - background)            # learn the background from quiet blocks only
                if time.ticks_diff(time.ticks_ms(), last_loud) > HANG_MS:
                    on = False
            led.value(on)
      `,
      notes: ['Clap, talk, then stay quiet: the light follows loud events and falls back one second later. Move the microphone to a noisy place and the background estimate rises, so the same sounds no longer trigger it.', 'To learn what was said, the next stage must be a model (ESP-SR on an ESP32-S3, or a keyword-spotting model, [[keyword-spotting]]). This program only decides when to wake it.', 'A microphone records people: tell anyone near the device, and do not send the audio anywhere without their consent.']
    }
  ],
  examples: [
    {
      title: 'How often may a wake word fire by mistake?',
      q: 'A smart speaker is in a living room 12 hours a day. The wake-word detector is specified at one false accept per 10 hours of audio. How many false wake-ups a week should the owner expect?',
      steps: ['12 hours a day for 7 days is $12 \\times 7 = 84$ hours of listening a week.', 'At one false accept per 10 hours: $84 / 10 = 8.4$ events a week.', 'The figure is for the test conditions: a noisy room with a television will be worse, and a quiet one better.'],
      a: 'About 8 false wake-ups a week, more than one a day. A threshold one notch higher could halve that and make the device miss a few more genuine calls.'
    }
  ],
  quiz: [
    { q: 'Why does a wake-word device listen locally instead of streaming all audio to a server?', choices: ['Servers cannot hear', 'It keeps the audio in the unit until the phrase is heard, and saves bandwidth and delay', 'The ESP32 has no Wi-Fi in listening mode', 'The microphone only works locally'], a: 1, why: 'On-device detection means nothing leaves the unit until the wake word is heard. Streaming continuously would cost bandwidth and invade privacy.' },
    { q: 'Which chip can run ESP-SR\'s wake-word and command engines?', choices: ['ESP32-C3', 'ESP32-C6', 'ESP32-S3', 'ESP32-C2'], a: 2, why: 'ESP-SR targets the ESP32-S3 and ESP32-P4: they have the vector instructions and PSRAM the models need. The small single-core chips do not.' },
    { q: 'Raising the detection threshold of a wake word removes both false accepts and false rejects.', a: false, why: 'A higher threshold reduces false accepts and increases false rejects. The two errors trade against each other.' },
    { q: 'Which stage is the cheapest, and the one that runs first?', choices: ['The command recogniser', 'The wake-word network', 'Voice activity detection', 'Speech-to-text on a server'], a: 2, why: 'A loudness-and-shape test is nearly free, so it runs all the time and wakes the heavier stages only when speech is likely.' }
  ],
  applications: [
    'A lamp, fan or curtain that responds to ten spoken commands with no network.',
    'A smart speaker or satellite for a home-automation system ([[voice-assistants]]).',
    'A kitchen timer or workshop controller operated hands-free.',
    'A wake-up gate in front of a camera or a recorder, so that it starts only when someone speaks.'
  ],
  sources: [
    'Espressif, *ESP-SR* documentation: audio front end, WakeNet and MultiNet (supported chips and languages).',
    'Pete Warden, "Speech Commands: A Dataset for Limited-Vocabulary Speech Recognition", 2018.',
    'ESPHome documentation, the micro_wake_word component (current state as of the version you use).'
  ],
  sim: 'au-voice-pipeline'
},

/* ================================================================ voice-assistants */
{
  id: 'voice-assistants',
  parent: 'audio',
  title: 'Building a voice assistant',
  level: 3,
  short: 'A voice assistant is a relay race: the device hears the wake word and captures speech, a server turns it into text and meaning and back into speech, and the device plays the answer. Where to cut the work, what each leg costs in time and data, and what to say about privacy.',
  keywords: ['voice assistant', 'speech to text', 'STT', 'TTS', 'Whisper', 'Piper', 'Home Assistant', 'Assist', 'Wyoming', 'voice satellite', 'ESPHome', 'intent', 'latency', 'streaming audio', 'endpointing', 'smart speaker', 'privacy', 'offline'],
  prereq: ['wake-words-and-speech-commands', 'internet-radio', 'rest-apis-and-json'],
  related: ['voice-assistant-firmware', 'home-assistant-voice-hardware', 'calling-cloud-ai', 'project-voice-lamp', 'cameras-and-the-law', 'audio-codecs', 'http-client'],
  body: `No ESP32 understands free speech by itself, and none needs to. A voice assistant is a relay race run by several machines, and the design question is only where to put the batons down.

### The legs of the race

1. **Hear.** On the device: microphones, front end, wake word ([[wake-words-and-speech-commands]]).
2. **Capture.** The device records or streams what follows, until it decides the speaker has stopped: *endpointing*, normally a second of quiet after speech.
3. **Speech to text.** A server converts the audio to words, using an open model such as Whisper on a home computer or a cloud service.
4. **Meaning.** Words become an **intent**: turn on this light, ask for the weather. Rules do it quickly; a large language model is flexible and slower. Home Assistant's *Assist* is a ready-made pipeline of these steps.
5. **Speak.** Text to speech (an open engine such as Piper, or a cloud voice) makes audio, which streams back to the device and plays through its speaker.

The ESP's role is the two ends: this is why such a device is called a **voice satellite**. ESPHome's voice assistant, and boards like the ESP32-S3-BOX-3 or Home Assistant's own voice hardware ([[home-assistant-voice-hardware]], [[voice-assistant-firmware]]), implement the satellite so that you configure rather than write it.

### What each leg costs

| Leg | Typical time | Data |
|---|---|---|
| Wake word, on the device | under 0.3 s | none leaves |
| Endpointing | 0.5 to 1 s of silence | none |
| Upload | while speaking | 32 kB/s (256 kbit/s) raw 16 kHz mono |
| Speech to text | 0.3 to 2 s | small text |
| Meaning | 0.05 s (rules) to several seconds (language model) | small |
| Speech synthesis | 0.3 to 1 s to first sound | audio back |

A reply therefore starts 1.5 to 5 seconds after you stop talking; streaming each stage into the next shaves the sum. These are orders of magnitude, not guarantees: the simulation below makes the budget concrete and shows where each stage runs.

### Data and privacy

Streaming all the time at 32 kB/s would be 2.7 GB a day and a recording of the whole household. Sending only what follows a wake word, say twenty four-second commands a day, is about 2.6 MB a day. That is the practical difference, and the ethical one. Say plainly in the design where audio goes, whether it is kept, and how the people in the room can switch the microphone off: a hardware switch is clearest. A microphone records people: consent and local law apply ([[cameras-and-the-law]]).

> [!key] A voice assistant splits work between the device (wake word, capture, playback) and a server (speech to text, meaning, text to speech). Send audio only after the wake word, endpoint with a second of silence, stream between stages to cut delay, and tell people what is recorded.`,
  ideas: [
    'A voice assistant is a chain: wake word and capture on the device, speech to text, meaning and speech synthesis on a server, then playback on the device.',
    'The ESP is a voice satellite: it needs a microphone, a speaker and a network, not a language model.',
    'The delay from end of speech to first reply is the sum of endpointing, recognition, meaning and synthesis, typically 1.5 to 5 seconds.',
    'Sending audio only after the wake word cuts data from gigabytes to megabytes a day, and keeps the household\'s ordinary conversation inside the room.'
  ],
  pitfalls: [
    'The ESP32 runs the language model — It does not. It captures and plays sound; recognition and meaning run on a computer in the house or a cloud service.',
    'The delay is the network\'s fault — Most of it is the models and the endpointing silence. A faster link barely changes it; streaming between stages and a faster server do.',
    'A privacy notice is enough — People in the room need to be able to see that the device is listening and to switch it off; a hardware mute switch is the clearest sign.'
  ],
  terms: [
    { term: 'Speech to text', also: ['STT', 'ASR', 'speech recognition'], def: 'Converting recorded speech into written words. Done by a model on a server; Whisper is a well-known open one.' },
    { term: 'Text to speech', also: ['TTS', 'speech synthesis'], def: 'Making spoken audio from written text. The reply of an assistant is synthesised and streamed back to the device.' },
    { term: 'Intent', also: ['intent recognition', 'natural-language understanding'], def: 'The structured meaning of a sentence, such as "turn on the kitchen light", that the system can act on.' },
    { term: 'Voice satellite', also: ['satellite', 'voice endpoint'], def: 'A small device with a microphone and speaker that hears the wake word and relays audio to a server which does the thinking.' },
    { term: 'Endpointing', also: ['end-of-speech detection'], def: 'Deciding that the speaker has finished, usually after a short stretch of quiet following speech. It adds directly to the delay of the answer.' }
  ],
  choose: {
    good: ['A voice satellite on an ESP32-S3 with a home server for recognition and synthesis', 'Wake word on the device, audio sent only afterwards', 'A hardware mute switch and a visible indicator when listening'],
    avoid: ['Streaming all audio all the time', 'Expecting the chip to run speech recognition for free speech', 'Hiding where audio goes and whether it is stored'],
    check: ['The total delay from end of speech to first sound, measured in the room', 'What the server logs and keeps', 'What happens when the network or the server is down']
  },
  code: [
    {
      title: 'Capture two seconds and ask your own server what was said',
      about: 'The device half of an assistant, reduced to its bones: records two seconds from an I2S microphone, sends the raw 16 kHz, 16-bit samples to a speech-to-text server you run yourself, and prints the text that comes back. It needs a server that accepts the bytes and replies with text; the address below is a placeholder.',
      needs: 'An ESP32 DevKit, an INMP441-type I2S microphone (L/R to GND), Wi-Fi, and a server on your network. Everyone who may be recorded must know.',
      wiring: [['GPIO32', 'microphone SCK'], ['GPIO25', 'microphone WS'], ['GPIO33', 'microphone SD'], ['3V3', 'microphone VDD'], ['GND', 'microphone GND and L/R']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2S input: BCLK (32) WS (25) data (33) at (16000) Hz, 32 bit mono, left slot :: sound
          connect to Wi-Fi [your-ssid] password [your-password]

        forever
          print [speak now ...]
          set [clip v] to (record (2) seconds from I2S as 16-bit samples with gain (4) :: sound)
          set [answer v] to (http post (clip) to [http://192.168.1.50:8000/transcribe] as [audio/L16; rate=16000])
          print (join [heard: ] (answer))
          wait (5) seconds
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <HTTPClient.h>
        #include <ESP_I2S.h>

        const char *SSID = "your-ssid";                    // do not leave real credentials in shared code
        const char *PASS = "your-password";
        const char *SERVER = "http://192.168.1.50:8000/transcribe";   // your own speech-to-text server

        I2SClass i2s;
        const int PIN_BCLK = 32, PIN_WS = 25, PIN_DIN = 33;
        const int RATE = 16000;
        const int SAMPLES = RATE * 2;                      // two seconds
        int16_t pcm[SAMPLES];                              // 64 000 bytes

        void setup() {
          Serial.begin(115200);
          i2s.setPins(PIN_BCLK, PIN_WS, -1, PIN_DIN);
          if (!i2s.begin(I2S_MODE_STD, RATE, I2S_DATA_BIT_WIDTH_32BIT, I2S_SLOT_MODE_MONO)) while (true) delay(1000);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
        }

        void loop() {
          Serial.println("speak now ...");
          int32_t raw[256];
          int got = 0;
          while (got < SAMPLES) {
            size_t n = i2s.readBytes((char *)raw, sizeof(raw)) / sizeof(int32_t);
            for (size_t i = 0; i < n && got < SAMPLES; i++) {
              pcm[got++] = (int16_t)constrain(raw[i] >> 14, -32768, 32767);   // 24 bits down to 16, with a gain of 4
            }
          }
          HTTPClient http;
          http.begin(SERVER);
          http.addHeader("Content-Type", "audio/L16; rate=16000");
          int code = http.POST((uint8_t *)pcm, sizeof(pcm));
          if (code == 200) Serial.println("heard: " + http.getString());
          else Serial.printf("server answered %d\n", code);
          http.end();
          delay(5000);
        }
      `,
      py: String.raw`
        import network, time, array, requests
        from machine import I2S, Pin

        SSID = "your-ssid"                                 # do not leave real credentials in shared code
        PASS = "your-password"
        SERVER = "http://192.168.1.50:8000/transcribe"     # your own speech-to-text server
        PIN_BCLK, PIN_WS, PIN_DIN = 32, 25, 33
        RATE = 16000
        SAMPLES = RATE * 2                                 # two seconds

        mic = I2S(0, sck=Pin(PIN_BCLK), ws=Pin(PIN_WS), sd=Pin(PIN_DIN),
                  mode=I2S.RX, bits=32, format=I2S.MONO, rate=RATE, ibuf=8192)
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect(SSID, PASS)
        while not wlan.isconnected():
            time.sleep_ms(250)

        raw = array.array("i", [0] * 256)
        pcm = array.array("h", [0] * SAMPLES)              # 64 000 bytes

        while True:
            print("speak now ...")
            got = 0
            while got < SAMPLES:
                n = mic.readinto(raw) // 4
                for i in range(n):
                    if got < SAMPLES:
                        pcm[got] = max(-32768, min(32767, raw[i] >> 14))   # 24 bits down to 16, with a gain of 4
                        got += 1
            r = requests.post(SERVER, data=bytes(pcm), headers={"Content-Type": "audio/L16; rate=16000"})
            if r.status_code == 200:
                print("heard:", r.text)
            else:
                print("server answered", r.status_code)
            r.close()
            time.sleep(5)
      `,
      output: `
        speak now ...
        heard: turn on the kitchen light
      `,
      notes: ['The server is yours to write or run: any program that accepts the POSTed samples, hands them to a speech-to-text engine and replies with the text will do. Use plain HTTP only on a network you trust ([[https-and-tls]]).', 'Two seconds is a fixed window. A real assistant starts on a wake word and stops when the speaker pauses ([[wake-words-and-speech-commands]]).', 'The microphone records people. Tell everyone who may be near it, and do not send audio away without their consent.']
    }
  ],
  formulas: [
    {
      name: 'Audio sent to a server in a day',
      expr: 'D = r*t',
      tex: 'D = r \\, t',
      vars: {
        D: { name: 'kilobytes sent per day' },
        r: { name: 'raw rate in kB/s (16 kHz, 16 bits, mono is 32)', value: 32, min: 0 },
        t: { name: 'seconds of audio sent per day', value: 80, min: 0 }
      },
      solveFor: 'D',
      note: 'Twenty four-second commands a day is t = 80 s: about 2.6 MB. Streaming all day is t = 86 400 s: about 2.8 GB. Compression (Opus, for example) divides the rate, and the time still counts.',
      stories: { D: 'A raw stream of {r} kB/s is sent for {t} seconds a day. How many kilobytes is that?', t: 'A raw stream of {r} kB/s must stay under {D} kilobytes a day. How many seconds of audio may be sent?' },
      practice: { unknowns: ['D', 't'] }
    }
  ],
  examples: [
    {
      title: 'The delay budget of a spoken question',
      q: 'After you stop speaking, the device waits 0.8 s of silence, the server needs 0.7 s for speech to text, 0.2 s for the intent and 0.5 s for the first audio of the reply. When does the answer begin?',
      steps: ['Add the legs: $0.8 + 0.7 + 0.2 + 0.5 = 2.2$ s.', 'The wake word and the speech itself came before the silence and are not part of this wait.', 'A large language model for the intent (3 s) would make it 5 s; a stricter endpoint (0.5 s) saves 0.3 s.'],
      a: 'About 2.2 seconds after you stop talking. Most of the budget is silence-detection and the two models, not the network.'
    }
  ],
  quiz: [
    { q: 'What does an ESP32 voice satellite do?', choices: ['Runs the language model', 'Hears the wake word, captures speech and plays the reply', 'Replaces the router', 'Stores all conversations'], a: 1, why: 'The satellite is the two ends of the race; recognition and meaning run on a server.' },
    { q: 'Raw 16 kHz, 16-bit mono audio is streamed to a server for a whole day. About how much data is that?', choices: ['2.8 MB', '28 MB', '280 MB', '2.8 GB'], a: 3, why: '32 kB/s × 86 400 s = 2.76 GB. Sending only commands after a wake word is a thousand times less.' },
    { q: 'A faster Wi-Fi link will cut the answer delay of an assistant to a fraction.', a: false, why: 'The delay is mostly the endpointing silence, recognition and synthesis. The audio itself is a small stream; the link adds only tens of milliseconds.' },
    { q: 'Which is the most visible way to respect the people in the room?', choices: ['A paragraph in the manual', 'A hardware mute switch and an indicator that shows when the device listens', 'Sending the audio over HTTPS', 'A lower sample rate'], a: 1, why: 'People need to see and control whether the microphone is live. A physical switch cannot be bypassed by software.' }
  ],
  applications: [
    'A Home Assistant voice satellite in each room, with local recognition on a home server ([[voice-assistant-firmware]]).',
    'A voice-controlled lamp or appliance, with the commands recognised on the device ([[project-voice-lamp]]).',
    'A talking kiosk or intercom where an operator or a service answers.',
    'A hands-free logbook that sends dictated notes to a server and stores the text.'
  ],
  sources: [
    'Home Assistant documentation, *Assist*: the voice pipeline, wake words and voice satellites.',
    'Espressif, user guides of the ESP32-S3-BOX-3 and the ESP-SR framework: the device side of voice interaction.',
    'Alec Radford and others (OpenAI), "Robust speech recognition via large-scale weak supervision", 2022 (the Whisper models).'
  ],
  sim: { id: 'au-voice-pipeline', params: { arch: 'satellite' } }
}
);
