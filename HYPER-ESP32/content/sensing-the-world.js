/* HYPER-ESP32 · content/sensing-the-world.js
 *
 * Components and Circuits → "Sensing the world": choosing a sensor; temperature; humidity and pressure; light; distance;
 * presence by infrared and radar; motion (accelerometers, gyroscopes, IMUs); air quality; soil, water level and flow;
 * satellite position; calibration; and reading sensors so that the numbers can be trusted.
 * Simulations: sims/sensing-the-world.js (ids start with "sw-").
 */
Hyper.add(
/* ================================================================ choosing-a-sensor */
{
  id: 'choosing-a-sensor',
  parent: 'sensing-the-world',
  title: 'Choosing a sensor',
  level: 1,
  short: 'A sensor turns warmth, light, distance or a gas into a voltage, a pulse train or a number on a bus. Six questions — quantity, accuracy, interface, supply, current and surroundings — narrow a hundred parts to two.',
  keywords: ['sensor', 'transducer', 'accuracy', 'resolution', 'range', 'interface', 'analogue', 'digital sensor', 'breakout board', 'response time', 'datasheet', 'look-alike', 'counterfeit', 'I2C address', 'chip ID'],
  prereq: ['three-volt-logic', 'choosing-a-bus', 'voltage-dividers-for-inputs'],
  related: ['accuracy-resolution-precision', 'sensor-calibration', 'reading-sensors-reliably', 'i2c-addresses-and-scanning', 'thermistors-and-ldrs', 'electronics:sensors', 'electronics:sensor-interfacing'],
  body: `A sensor turns something in the world — warmth, light, distance, a push, a gas — into something a chip can read: a voltage, a train of pulses, or a number sent over a bus. Beyond touch pins and a rough reading of its own silicon temperature the ESP32 senses nothing by itself, so every fact a project knows about the world comes through one of these small parts. Choosing well saves more time than any clever code afterwards.

### Six questions before a part number

1. **What quantity, over what range?** A room thermometer and an oven controller differ.
2. **How good must it be?** *Accuracy* is closeness to the truth, *resolution* the smallest step shown: a sensor can display hundredths of a degree and be two degrees wrong ([[accuracy-resolution-precision]]).
3. **How does it talk to the ESP?** See the table.
4. **What does it run on?** Its supply, and the voltage of its signals: a 5 V part may need a [[voltage-dividers-for-inputs|divider]] or a [[level-shifters|level shifter]].
5. **What does it cost in current?** A part drawing 15 mA all day empties a small battery in days ([[battery-life-budget]]).
6. **What does it need around it?** A warm-up, a view of the sky, pull-ups, a calibration, a spot away from the warm regulator.

### Four ways a sensor reports

| It gives | Examples | The ESP uses | Watch for |
|---|---|---|---|
| A voltage following the quantity | NTC thermistor, light-dependent resistor, soil probe | the ADC (ADC1 with Wi-Fi on) | noise, the ADC's curve ([[the-esp-adc]]) |
| Pulses: a width or a rate | HC-SR04 echo, flow meter | a timer, pulse counter or interrupt | missed pulses, 5 V levels |
| A message on one wire | DS18B20 ([[one-wire]]), DHT22 | a library with exact timing | the pull-up resistor |
| Numbers on a bus | BME280, BH1750 ([[i2c]]); MAX31855 ([[spi]]); GNSS, dust sensors ([[uart]]) | the bus peripheral | addresses, pull-ups, [[registers-and-datasheets|registers]] |

Bus sensors convert, calibrate and compensate themselves, and the numbers arrive in units. Analogue ones are simple and fast, and every correction is your own job.

### Reading a datasheet

- **Accuracy holds over a range.** "±0.5 °C" for a DS18B20 is true from −10 to +85 °C only.
- **Typical is not guaranteed.** Design with the *maximum* figure.
- **Response time** is how long the sensor takes to follow a change: a bare thermistor, a second or two; a probe in a steel tube, ten seconds.
- **Breakout boards** add a regulator, pull-ups, sometimes a level shifter — and sometimes a different chip from the one on the label. Markets are full of look-alikes: a "BME280" that is a humidity-less BMP280, a counterfeit DS18B20. Read the chip's identity register and compare with a trusted instrument ([[sensor-calibration]]).

> [!key] Choose a sensor by quantity, range, accuracy, interface, supply, current and surroundings. Prefer a bus sensor when accuracy matters, an analogue one for speed and simplicity — and check what is really on the board.`,
  ideas: [
    'A sensor reports as a voltage, as pulses, as a one-wire message or as numbers on a bus; the ESP needs a different peripheral for each.',
    'Accuracy (closeness to the truth) and resolution (smallest step) are different things.',
    'Datasheet accuracy holds over a stated range; typical figures are not guarantees.',
    'Breakout boards and cheap listings often carry look-alike chips: read the identity register.'
  ],
  pitfalls: [
    'A sensor with 0.01 °C resolution is accurate to 0.01 °C — Resolution is the step of the display; accuracy is the error of the value. A part may show hundredths and be wrong by whole degrees.',
    'A digital sensor needs no care — It still needs the right supply voltage, pull-ups, a warm-up and a sensible position; and its numbers can still be wrong.',
    'If the board says BME280 it is a BME280 — Many boards sold under that name are the BMP280, which measures no humidity. The identity register tells the truth.'
  ],
  terms: [
    { term: 'Sensor', also: ['transducer'], def: 'A part that converts a physical quantity — temperature, light, distance, force — into an electrical signal the microcontroller can read.' },
    { term: 'Accuracy', also: ['error', 'uncertainty'], def: 'How close a reading is to the true value, as a number such as ±0.5 °C. It is not the same as resolution, and it is usually stated only over a range of conditions.' },
    { term: 'Resolution', also: ['LSB', 'step size'], def: 'The smallest change a sensor or converter can report. A 12-bit temperature value in 0.0625 °C steps has a resolution of 0.0625 °C, whatever its accuracy.' },
    { term: 'Response time', also: ['time constant', 'settling time'], def: 'How long a sensor takes to follow a sudden change of the quantity — often quoted as the time to reach 63 % (one time constant) or 90 % of the step.' },
    { term: 'Breakout board', also: ['module', 'sensor board'], def: 'A small circuit board that carries a bare sensor chip with the parts it needs (regulator, pull-ups, connector) so that it can be wired with jumper leads.' }
  ],
  choose: {
    good: ['A bus sensor (I2C or 1-Wire) with a library, when the numbers must be right', 'An analogue part for cheap, fast or very simple jobs', 'Buying a part with a named datasheet and an address you can verify'],
    avoid: ['Choosing on price alone', 'Reading resolution as if it were accuracy', 'Wiring a 5 V signal straight into a GPIO'],
    check: ['That supply, logic level and I2C address fit your other parts', 'The identity register of what actually arrived', 'The current while measuring and while idle', 'The response time against how fast the quantity changes']
  },
  code: [
    {
      title: 'Name what is on the I2C bus',
      about: 'Asks every address from 1 to 126 whether anyone answers, and prints the usual owner of each. The first thing to run with a new sensor on the bus: it proves the wiring, shows the address and hints at what the chip really is.',
      needs: 'An ESP32 DevKit and any I2C sensor board (4.7 kΩ pull-ups are usually on the board).',
      wiring: [['GPIO21', 'sensor SDA', 'S3 and C3 boards: GPIO8'], ['GPIO22', 'sensor SCL', 'S3 and C3 boards: GPIO9'], ['3V3', 'sensor VCC'], ['GND', 'sensor GND']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22)
          for each [address v] in (the numbers 1 to 126)
            if <(a device answers at I2C address (address))> then    // it acknowledged: someone is home
              print (join [found 0x] (hex (address)) [  ] (usual owner of (address)))
            end
          end
          print [scan finished]
      `,
      cpp: String.raw`
        #include <Wire.h>

        const int SDA_PIN = 21, SCL_PIN = 22;      // S3 and C3 boards: 8 and 9

        const char *owner(uint8_t a) {             // the usual owners of common sensor addresses
          switch (a) {
            case 0x23: return "BH1750 light sensor";
            case 0x29: return "VL53L0X distance / TSL2591 light";
            case 0x38: return "AHT10 / AHT20 humidity";
            case 0x44: return "SHT3x / SHT4x humidity";
            case 0x62: return "SCD4x CO2";
            case 0x68: return "MPU6050 motion (or a DS3231 clock)";
            case 0x76: case 0x77: return "BME280 / BMP280 pressure";
            default:   return "unknown: look it up";
          }
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(SDA_PIN, SCL_PIN, 100000);    // (sda, scl, frequency)
          for (uint8_t a = 1; a < 127; a++) {
            Wire.beginTransmission(a);
            if (Wire.endTransmission() == 0)       // 0 = the address was acknowledged
              Serial.printf("found 0x%02X  %s\n", a, owner(a));
          }
          Serial.println("scan finished");
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin

        OWNERS = {                                  # the usual owners of common sensor addresses
            0x23: "BH1750 light sensor",
            0x29: "VL53L0X distance / TSL2591 light",
            0x38: "AHT10 / AHT20 humidity",
            0x44: "SHT3x / SHT4x humidity",
            0x62: "SCD4x CO2",
            0x68: "MPU6050 motion (or a DS3231 clock)",
            0x76: "BME280 / BMP280 pressure",
            0x77: "BME280 / BMP280 pressure",
        }

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=100000)   # S3 and C3 boards: scl 9, sda 8
        for a in i2c.scan():                        # the addresses that acknowledged
            print("found 0x%02X  %s" % (a, OWNERS.get(a, "unknown: look it up")))
        print("scan finished")
      `,
      output: `
        found 0x23  BH1750 light sensor
        found 0x76  BME280 / BMP280 pressure
        scan finished
      `,
      notes: ['The address says which *family* answers, not which chip: 0x76 is both the BME280 and the humidity-less BMP280. Read the identity register to tell them apart ([[humidity-and-pressure-sensors]]).', 'Nothing found: swap SDA and SCL, check the 3.3 V and ground, and look for missing pull-ups ([[i2c-pull-ups-and-bus-problems]]).']
    }
  ],
  examples: [
    {
      title: 'What does ±2 °C actually promise?',
      q: 'A sensor shows 21.37 °C. Its datasheet gives a resolution of 0.01 °C and an accuracy of ±2 °C. Within what range is the true temperature, and does the second decimal mean anything?',
      steps: ['The accuracy is ±2 °C, so the true value lies in the band $21.37 \\pm 2$, from 19.37 to 23.37 °C.', 'The resolution only says that the display moves in steps of 0.01 °C. It tells you nothing about the error.', 'What the second decimal does show is a *change*: when the reading goes from 21.37 to 21.41 °C the sensor really did notice something warmer, if its error stays constant — which is often true over short times.'],
      a: 'The true temperature is between 19.4 and 23.4 °C. The digits are good for watching changes, not for knowing the level — unless the sensor is calibrated ([[sensor-calibration]]).'
    }
  ],
  quiz: [
    { q: 'A datasheet lists a resolution of 0.01 °C and an accuracy of ±2 °C. The sensor reads 21.37 °C. What can you say?', choices: ['The true temperature is 21.37 °C to within 0.01 °C', 'The true temperature is between about 19.4 and 23.4 °C', 'The sensor is broken because the two figures disagree', 'The accuracy is 0.01 °C near room temperature'], a: 1, why: 'Accuracy is the error bound of the value: ±2 °C around the reading. Resolution is merely the size of the step in which the reading moves.' },
    { q: 'Which kind of sensor output needs an ADC pin, and with Wi-Fi running on an original ESP32 which ADC unit?', choices: ['A bus sensor; ADC2', 'A voltage-output sensor such as an NTC divider; ADC1', 'A one-wire sensor; ADC2', 'A pulse output; ADC1'], a: 1, why: 'Only analogue voltages go to the ADC, and on the original ESP32 the ADC2 pins cannot be read while Wi-Fi is on, so ADC1 (GPIO32–39) is the safe choice.' },
    { q: 'A datasheet\'s "typical" accuracy is guaranteed for every part sold.', a: false, why: 'Typical is what most parts do. The maximum figure is the one every part meets; design with that, or calibrate each unit.' },
    { q: 'A board sold as BME280 reports temperature and pressure but humidity is always zero. What is the most likely cause?', choices: ['A wiring fault on SDA', 'It is a BMP280, which has no humidity sensor', 'The pull-ups are too large', 'The ESP32 cannot read humidity'], a: 1, why: 'The BMP280 looks the same and answers on the same addresses but measures no humidity. Its chip ID is 0x58 where the BME280\'s is 0x60.' }
  ],
  applications: [
    'Every sensor project starts with a parts choice: the same weather station can be built with a basic or a precise thermometer, and the difference lies in the questions above.',
    'Fault finding on a new board begins with a bus scan to see whether the sensor answers at the address it should.',
    'Product designers pick sensors by supply, interface and standby current long before accuracy, because the battery decides.',
    'Counterfeit and relabelled sensors are a real supply-chain problem; reading the chip ID is part of incoming inspection.'
  ],
  sources: [
    'JCGM 200, *International Vocabulary of Metrology* (VIM): the definitions of accuracy, precision and resolution.',
    'NXP, *UM10204, I2C-bus specification and user manual*: addresses and the scan procedure.',
    'Bosch Sensortec, *BME280 and BMP280 datasheets*: the chip identification register.'
  ],
  sim: 'sw-chooser'
}
,

/* ================================================================ temperature-sensors */
{
  id: 'temperature-sensors',
  parent: 'sensing-the-world',
  title: 'Temperature: DS18B20, NTC, thermocouples',
  level: 1,
  short: 'A digital chip on one wire (DS18B20), a resistor that changes with warmth (an NTC thermistor) and a pair of dissimilar wires for furnace temperatures (a thermocouple) cover almost every temperature job. Choose by range, accuracy and how much work the ESP should do.',
  keywords: ['temperature', 'DS18B20', 'NTC', 'thermistor', 'beta equation', 'thermocouple', 'type K', 'MAX31855', 'MAX6675', 'cold junction', '1-Wire', 'conversion time', 'self-heating', '85 °C', '-127', 'MLX90614', 'TMP102'],
  prereq: ['choosing-a-sensor', 'one-wire', 'thermistors-and-ldrs'],
  related: ['humidity-and-pressure-sensors', 'sensor-calibration', 'internal-temperature-sensor', 'the-esp-adc', 'thermostats', 'electronics:thermistors-rtd', 'electronics:thermocouples'],
  body: `Temperature is the most measured quantity in electronics. An ESP gets three practical ways to do it: a digital chip, a resistor whose value follows the warmth, and a pair of dissimilar wires for places that would melt the others.

### DS18B20: the digital default

The DS18B20 measures −55 to +125 °C, is accurate to ±0.5 °C from −10 to +85 °C, and answers over a single data wire ([[one-wire]]) from 3.0–5.5 V. Each chip has a unique 64-bit code, so many share one wire; it also comes sealed in a stainless tube on a cable. Resolution is chosen at 9, 10, 11 or 12 bits — steps of 0.5, 0.25, 0.125 and 0.0625 °C — and the price is time: a 12-bit conversion takes 750 ms, a 9-bit one about 94 ms ([the simulation](#/c/temperature-sensors?s=sim) shows the trade). Three details catch everyone:

- **The pull-up.** The data line needs 4.7 kΩ to 3.3 V. Probe breakouts often have it; bare chips do not.
- **85.0 °C** is the register's power-up value. Seeing it means you read before a conversion finished, or never started one.
- **−127 °C** is what the common library reports for a sensor that does not answer: a loose wire or a missing pull-up.

### NTC thermistor: simple and quick

An NTC thermistor falls in resistance as it warms. A common one is 10 kΩ at 25 °C; with B = 3950 K it is about 33.6 kΩ at 0 °C and 3.6 kΩ at 50 °C. Put it in a divider with a fixed 10 kΩ resistor ([[thermistors-and-ldrs]]), read the middle with the ADC, turn the voltage into a resistance and that into a temperature with the **beta equation** below. It is among the cheapest sensors, small and fast.

Its weak points: the curve is steep near 25 °C and flat at the ends; the ESP32's ADC is not linear ([[the-esp-adc]]); the divider current warms the bead; and a 1 % resistor means about 0.2 °C near 25 °C, a 5 % one over 1 °C. Without calibration expect ±1 °C at best.

### Thermocouples: for the hot places

Two dissimilar metals joined at one end make a tiny voltage that depends on the *difference* between that junction and the cold end — about 41 µV per °C for type K, from −200 to +1350 °C, which no chip survives. The voltage needs amplifying and the cold end's temperature adding, so use an interface chip: the MAX31855 (type K, SPI, 0.25 °C steps, flags an open or shorted probe) or the older MAX6675. Accuracy: a few degrees.

### Others, and where to put it

I2C chips such as the TMP102 or LM75 (0x48); the temperature of a BME280 or SHT40 ([[humidity-and-pressure-sensors]]); infrared sensors like the MLX90614 (0x5A), which read the *surface* they see. The ESP32's own sensor ([[internal-temperature-sensor]]) reads its silicon, warmer than the room. Keep sensors away from the regulator and the radio, which warm a board by several degrees.

> [!key] A DS18B20 gives a trustworthy number with one wire and a pull-up, at 750 ms per 12-bit reading; an NTC is cheap and quick but needs the beta equation and calibration; a thermocouple is for heat no chip can stand. Keep them from the board's warmth.`,
  ideas: [
    'The DS18B20 is a digital sensor on one wire: ±0.5 °C, a unique code per chip, 9 to 12 bits, up to 750 ms per conversion.',
    'An NTC thermistor in a divider is cheap and fast, but turning volts into degrees takes the beta equation and the ADC\'s curve limits accuracy.',
    'A thermocouple measures a temperature difference in microvolts and needs an interface chip with cold-junction compensation.',
    'A reading of 85.0 °C or −127 °C from a DS18B20 is a fault marker, not a temperature.'
  ],
  pitfalls: [
    'The DS18B20 reads 85 °C, so the room is hot — 85.0 °C is its power-up value. The program read before a conversion had finished; wait 750 ms after requesting one.',
    'A thermistor gives the same accuracy at every temperature — The curve flattens at both ends: one ADC step is a small fraction of a degree near 25 °C and several tenths at 70 °C, and tolerances add to it.',
    'A thermocouple\'s voltage is its temperature — It is the difference between the hot junction and the cold end, so the cold end\'s temperature must be measured and added; that is what an interface chip does.'
  ],
  terms: [
    { term: 'DS18B20', also: ['Dallas 1-Wire thermometer'], def: 'A digital temperature chip with a unique 64-bit code that reports over the 1-Wire bus: ±0.5 °C from −10 to +85 °C, 9 to 12 bits, 3.0–5.5 V supply.' },
    { term: 'NTC thermistor', also: ['negative temperature coefficient', 'beta equation'], def: 'A resistor whose resistance falls as it warms. Its value at 25 °C (often 10 kΩ) and a constant B describe the curve; the beta equation turns a measured resistance into a temperature.' },
    { term: 'Thermocouple', also: ['type K', 'cold junction'], def: 'Two dissimilar metals joined at one end, which produce a voltage proportional to the temperature difference between that junction and the open ends. Type K gives about 41 µV per °C.' },
    { term: 'Cold-junction compensation', also: ['CJC'], def: 'Measuring the temperature of the thermocouple\'s connection to the electronics and adding it to the temperature difference, so that the result is an absolute temperature.' },
    { term: 'Conversion time', also: ['measurement time'], def: 'The time between starting a measurement and the result being ready: 750 ms for a 12-bit DS18B20 reading. The program must wait for it or do other work meanwhile.' }
  ],
  choose: {
    good: ['DS18B20: accurate air, liquid or soil temperature with one wire and no calibration', 'NTC thermistor: fast, small, cheap, over about 0 to 60 °C, when you can calibrate', 'Thermocouple with a MAX31855: ovens, kilns and exhausts above 125 °C', 'Several DS18B20s on one wire for a multi-point profile'],
    avoid: ['A thermistor straight into an ADC2 pin while Wi-Fi is on (original ESP32)', 'A DS18B20 above 125 °C, or a thermocouple where 0.1 °C matters', 'The ESP32\'s internal sensor as an air thermometer', 'Long unshielded thermocouple leads next to motors'],
    check: ['The 4.7 kΩ pull-up on the data line', 'The conversion time against how often you read', 'The beta value and 25 °C resistance of your actual thermistor', 'That the probe tip, not the cable, is in the medium']
  },
  formulas: [
    {
      name: 'Beta equation of an NTC thermistor',
      expr: 'T = 1/(1/T0 + ln(R/R0)/B)',
      tex: 'T = \\frac{1}{\\frac{1}{T_0} + \\frac{1}{B}\\ln\\frac{R}{R_0}}',
      vars: {
        T: { name: 'temperature of the thermistor', q: 'temperature', unit: '°C', tex: 'T' },
        T0: { name: 'reference temperature (usually 25 °C)', q: 'temperature', unit: '°C', value: 25, tex: 'T_0' },
        B: { name: 'beta constant of the part', q: 'temperature', unit: 'K', value: 3950, tex: 'B' },
        R: { name: 'measured resistance', q: 'resistance', unit: 'kΩ', value: 17.5, tex: 'R' },
        R0: { name: 'resistance at the reference temperature', q: 'resistance', unit: 'kΩ', value: 10, tex: 'R_0' }
      },
      solveFor: 'T',
      note: 'Temperatures are absolute (kelvin) inside the equation; the calculator converts for you. The equation is accurate to about a degree over a span of some 50 °C around the reference; a part\'s datasheet may give a better fit (Steinhart–Hart) for a wide range.',
      stories: {
        T: 'A 10 kΩ NTC with B = 3950 K measures {R}. What is its temperature?',
        R: 'The same thermistor sits at {T}. What resistance should the divider see?'
      }
    }
  ],
  examples: [
    {
      title: 'From a voltage to a temperature',
      q: 'An NTC thermistor (10 kΩ at 25 °C, B = 3950 K) sits between 3.3 V and the ADC pin, with a 10 kΩ resistor from the pin to ground. The calibrated reading is 1.20 V. What is the temperature?',
      steps: [{ text: 'The pin voltage is $V = 3.3\\,\\mathrm{V}\\cdot\\frac{10}{10 + R}$. Solve for the thermistor:', tex: 'R = 10\\,\\mathrm{k\\Omega}\\cdot\\frac{3.3 - 1.20}{1.20} = 17.5\\,\\mathrm{k\\Omega}' }, { text: 'Insert into the beta equation with $T_0 = 298.15$ K:', tex: '\\frac{1}{T} = \\frac{1}{298.15} + \\frac{\\ln(1.75)}{3950} = 0.003354 + 0.000142 = 0.003496\\ \\mathrm{K^{-1}}' }, 'So $T = 286.1$ K, which is 12.9 °C. A reading of 1.65 V would have meant exactly 25 °C: equal resistors halve the supply.'],
      a: 'About 12.9 °C. At this reading one ADC step of roughly 1 mV is a few hundredths of a degree; at 70 °C the same step is worth several times more.'
    }
  ],
  code: [
    {
      title: 'A DS18B20 that never blocks',
      about: 'Starts a conversion, goes on with other work, and reads the result 750 ms later. A fault value is reported instead of being printed as a temperature.',
      needs: 'An ESP32 DevKit and a DS18B20 (bare, or a waterproof probe) with a 4.7 kΩ resistor from data to 3V3.',
      libs: ['OneWire', 'DallasTemperature'],
      wiring: [['GPIO4', 'DS18B20 data (yellow or white)', '4.7 kΩ to 3V3'], ['3V3', 'DS18B20 VCC (red)'], ['GND', 'DS18B20 GND (black)']],
      blocks: `
        when started
          start serial at (115200) baud
          set [converting v] to <false>
          set [last v] to (milliseconds since start)
        forever
          if <<not <converting>> and <((milliseconds since start) - (last)) ≥ (2000)>> then
            start a conversion on the 1-Wire sensors on pin (4) :: sensing
            set [started v] to (milliseconds since start)
            set [converting v] to <true>
          else if <<converting> and <((milliseconds since start) - (started)) ≥ (750)>> then
            print (join [DS18B20 ] (temperature of 1-Wire sensor (1)) [ C])
            set [converting v] to <false>
            set [last v] to (milliseconds since start)
          end
          do the other work    // never held up :: my
        end
      `,
      cpp: String.raw`
        #include <OneWire.h>
        #include <DallasTemperature.h>

        const int ONE_WIRE_PIN = 4;                 // data, with a 4.7 kΩ pull-up to 3V3
        OneWire oneWire(ONE_WIRE_PIN);
        DallasTemperature sensors(&oneWire);

        uint32_t startedAt = 0, lastRead = 0;
        bool converting = false;

        void setup() {
          Serial.begin(115200);
          sensors.begin();
          sensors.setResolution(12);                // 12 bit: 0.0625 °C steps, 750 ms
          sensors.setWaitForConversion(false);      // requestTemperatures() returns at once
        }

        void loop() {
          uint32_t now = millis();
          if (!converting && now - lastRead >= 2000) {
            sensors.requestTemperatures();          // start a conversion on every sensor
            startedAt = now;
            converting = true;
          } else if (converting && now - startedAt >= 750) {
            float t = sensors.getTempCByIndex(0);
            converting = false;
            lastRead = now;
            if (t == DEVICE_DISCONNECTED_C) Serial.println("DS18B20 not answering: check wiring and pull-up");
            else Serial.printf("DS18B20 %.2f C\n", t);
          }
          // other work goes here and is never held up
        }
      `,
      py: String.raw`
        from machine import Pin
        import onewire, ds18x20, time

        ds = ds18x20.DS18X20(onewire.OneWire(Pin(4)))   # data on GPIO4, 4.7 kΩ pull-up to 3V3
        roms = ds.scan()                                 # the 64-bit codes of the sensors found
        if not roms:
            print("DS18B20 not answering: check wiring and pull-up")

        converting = False
        started = last = time.ticks_ms()
        while roms:
            now = time.ticks_ms()
            if not converting and time.ticks_diff(now, last) >= 2000:
                ds.convert_temp()                        # start a conversion, returns at once
                started, converting = now, True
            elif converting and time.ticks_diff(now, started) >= 750:
                print("DS18B20 %.2f C" % ds.read_temp(roms[0]))
                converting = False
                last = now
            # other work goes here and is never held up
      `,
      output: `
        DS18B20 21.94 C
        DS18B20 21.94 C
        DS18B20 22.00 C
      `,
      notes: ['MicroPython\'s ds18x20 module works at 12 bits; the Arduino library lets you lower the resolution to speed things up.', 'To read several probes, call `getTempCByIndex(i)` for each (or loop over `roms`): one conversion serves them all.']
    },
    {
      title: 'An NTC thermistor on an ADC pin',
      about: 'Reads the divider 16 times, converts the voltage to a resistance and the resistance to a temperature with the beta equation.',
      needs: 'An ESP32 DevKit, a 10 kΩ NTC thermistor (B = 3950) and a 10 kΩ resistor.',
      wiring: [['3V3', 'NTC, one leg'], ['GPIO34', 'NTC other leg and 10 kΩ resistor', 'ADC1: safe with Wi-Fi'], ['GND', '10 kΩ resistor, other leg']],
      blocks: `
        when started
          start serial at (115200) baud
        forever
          set [mv v] to (average of (16) readings of (analog read pin (34) in millivolts))
          set [r v] to (((10) * ((3300) - (mv))) / (mv))    // thermistor in kilohms
          set [t v] to ((1) / (((1) / (298.15)) + ((ln ((r) / (10))) / (3950)))) - (273.15)
          print (join [NTC ] (round ((t) * (10)) / (10)) [ C])
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        const int NTC_PIN = 34;                      // ADC1 channel: usable with Wi-Fi on
        const float R_FIXED = 10000.0;               // the resistor to ground, in ohms
        const float R0 = 10000.0, T_REF = 298.15, BETA = 3950.0;   // (T0 is a name the core uses)
        const float VCC_MV = 3300.0;

        void setup() {
          Serial.begin(115200);
          analogSetPinAttenuation(NTC_PIN, ADC_11db);
        }

        void loop() {
          float mv = 0;
          for (int i = 0; i < 16; i++) mv += analogReadMilliVolts(NTC_PIN);
          mv /= 16;                                  // average of 16: less noise
          float r = R_FIXED * (VCC_MV - mv) / mv;    // thermistor resistance from the divider
          float tK = 1.0 / (1.0 / T_REF + log(r / R0) / BETA);
          Serial.printf("NTC %.1f C\n", tK - 273.15);
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import math, time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)      # ADC1 channel: usable with Wi-Fi on
        R_FIXED = 10000.0                            # the resistor to ground, in ohms
        R0, T0, BETA = 10000.0, 298.15, 3950.0
        VCC_MV = 3300.0

        while True:
            mv = sum(adc.read_uv() for _ in range(16)) / 16000   # average of 16, in millivolts
            r = R_FIXED * (VCC_MV - mv) / mv         # thermistor resistance from the divider
            t_k = 1.0 / (1.0 / T0 + math.log(r / R0) / BETA)
            print("NTC %.1f C" % (t_k - 273.15))
            time.sleep(1)
      `,
      output: `
        NTC 22.3 C
        NTC 22.4 C
      `,
      notes: ['Near the ends of the ADC range the reading is least accurate: choose the fixed resistor equal to the thermistor\'s value at the middle of your temperature range.', 'Reading the divider only now and then and powering it from a GPIO in between keeps self-heating and battery drain low.', 'A reading of 0 mV or 3300 mV means an open or shorted thermistor: reject it before the division.']
    }
  ],
  quiz: [
    { q: 'A DS18B20 program prints 85.0 °C on its first reading, then correct values. Why?', choices: ['The sensor is hot at power-up', '85.0 °C is the register\'s power-up value, read before a conversion finished', 'The pull-up resistor is too large', 'The first reading is always uncalibrated'], a: 1, why: 'The scratchpad holds 85 °C until the first conversion completes. Request a conversion and wait 750 ms (at 12 bits) before reading.' },
    { q: 'A DS18B20 returns −127 °C every time. What do you check first?', choices: ['The 4.7 kΩ pull-up and the wiring of the data line', 'The ADC attenuation', 'The I2C address', 'The Wi-Fi channel'], a: 0, why: '−127 °C is the library\'s "device disconnected" value: the sensor did not answer, which points to the data wire, its pull-up or the supply.' },
    { q: 'A 10 kΩ NTC (B = 3950 K) and a 10 kΩ resistor form a divider across 3.3 V, and the middle reads 1.65 V. What is the temperature?', choices: ['0 °C', '25 °C', '50 °C', 'It cannot be told without the ADC calibration'], a: 1, why: 'Equal resistors halve the supply, so the thermistor equals its 25 °C resistance of 10 kΩ.' },
    { q: 'A type K thermocouple on its own gives 4 mV. That means the hot end is at about 100 °C.', a: false, why: 'The voltage tracks the temperature *difference* between the hot junction and the cold end, and the cold end is not at 0 °C. 4 mV is roughly 100 °C above the connector\'s temperature; the interface chip adds the connector\'s temperature.' }
  ],
  applications: [
    'Waterproof DS18B20 probes in aquariums, brewing vessels, soil and heating-pipe monitoring.',
    'NTC thermistors in 3D-printer hot ends and beds, battery packs and chargers.',
    'Type K thermocouples in ovens, kilns, grills and the exhaust of engines.',
    'Several DS18B20s on one cable for a temperature profile of a tank or a room.'
  ],
  sources: [
    'Maxim Integrated, *DS18B20 Programmable Resolution 1-Wire Digital Thermometer* datasheet: resolution, conversion time and the 85 °C power-up value.',
    'Maxim Integrated, *MAX31855 Cold-Junction Compensated Thermocouple-to-Digital Converter* datasheet.',
    'Espressif, *ESP-IDF Programming Guide*, ADC calibration: why a calibrated millivolt reading beats raw counts.'
  ],
  sim: 'sw-ds18b20'
}
,

/* ================================================================ humidity-and-pressure-sensors */
{
  id: 'humidity-and-pressure-sensors',
  parent: 'sensing-the-world',
  title: 'Humidity and pressure: DHT22, SHT4x, BME280',
  level: 1,
  short: 'Humidity sensors report water vapour as a percentage that depends on temperature; pressure sensors weigh the air above them. The DHT22 is slow and coarse, the SHT40 careful, the BME280 three-in-one — and a cheap board labelled BME280 is often a BMP280 with no humidity at all.',
  keywords: ['humidity', 'relative humidity', 'RH', 'pressure', 'hPa', 'barometer', 'altitude', 'DHT22', 'DHT11', 'AM2302', 'SHT40', 'SHT4x', 'AHT20', 'BME280', 'BMP280', 'dew point', 'self-heating', 'forced mode', 'chip ID', 'sea-level pressure'],
  prereq: ['choosing-a-sensor', 'temperature-sensors', 'i2c'],
  related: ['air-quality-sensors', 'reading-sensors-reliably', 'sensor-calibration', 'project-weather-station', 'one-wire', 'physics:ideal-gas-law'],
  body: `**Relative humidity** (RH) is the water vapour in the air as a percentage of the most the air could hold at its temperature. Warm the same air and the percentage falls: 60 % at 20 °C is 53 % at 22 °C and 33 % at 30 °C. So an RH reading is only as good as the temperature *at the sensor*, and a sensor warmed by a nearby chip reads too dry ([the simulation](#/c/humidity-and-pressure-sensors?s=sim)). A **pressure** sensor weighs the air above it: about 1013 hPa at sea level, falling with height and with the weather.

### The parts

| Part | Measures | Bus, address | Typical accuracy | Note |
|---|---|---|---|---|
| DHT11 | RH, T | one wire, own protocol | ±5 % RH, ±2 °C | whole numbers only |
| DHT22 (AM2302) | RH, T | one wire, own protocol | ±2 % RH, ±0.5 °C | one read per 2 s |
| AHT20 | RH, T | I2C 0x38 | ±2 % RH, ±0.3 °C | small, 3.3 V |
| SHT40 | RH, T | I2C 0x44 | ±1.8 % RH, ±0.2 °C | the careful choice |
| BME280 | RH, P, T | I2C 0x76 or 0x77, SPI | ±3 % RH, ±1 hPa | three in one |
| BMP280 | P, T | I2C 0x76 or 0x77, SPI | ±1 hPa | **no humidity** |

The DHT parts speak a single-wire protocol that is *not* [[one-wire|1-Wire]]: after a start pulse the chip sends 40 bits whose timing the library measures. They are slow and drift over the years. The I2C parts answer in milliseconds and sleep between readings.

### Pressure, height and weather

Near sea level the pressure falls about 1 hPa for every 8 m of height, and a BME280's *relative* accuracy of about ±0.12 hPa resolves a metre or so: enough to tell which floor the sensor is on. To compare with a weather report, correct the reading to sea level using your height (formula below). A fall of several hPa in three hours means the weather is turning.

### Placement and care

- **Self-heating.** A BME280 left measuring continuously warms itself; use *forced mode*, which measures once and sleeps.
- **Keep it cool.** Mount the sensor on a short cable or behind a slot, away from the ESP and the regulator.
- **Water and fumes.** Condensation, splashes, solvents and flux vapours saturate or poison the polymer; recovery takes hours.
- **Look-alikes.** The BMP280 answers on the same addresses. Its chip ID is 0x58, the BME280's 0x60: read register 0xD0 (program 3).

> [!key] Relative humidity depends on temperature, so measure both at the same spot and keep the sensor out of the board's warmth. Prefer the SHT40 or BME280 over the DHT22 — and read the chip ID, because many "BME280" boards are BMP280s.`,
  ideas: [
    'Relative humidity falls when the air warms, so a sensor heated by its board reads too dry.',
    'The DHT22 is slow (one read per 2 s) and coarse; the SHT40 and BME280 are I2C parts that answer in milliseconds.',
    'Pressure falls about 1 hPa per 8 m of height; station pressure must be corrected to sea level to match weather reports.',
    'The BMP280 looks like the BME280 but has no humidity sensor; the chip ID (0x58 or 0x60) tells them apart.'
  ],
  pitfalls: [
    'The DHT22 shares the 1-Wire bus protocol with the DS18B20 — It has its own single-wire protocol with different timing; the two cannot share a pin or a library.',
    'Humidity of 40 % means the same everywhere — It is relative to the temperature: the same amount of vapour is 40 % in a warm room and 80 % in a cold cellar.',
    'The sensor and the ESP can sit on one board — The ESP and its regulator warm the board by several degrees, and the sensor then reports the warm board\'s humidity, not the room\'s.'
  ],
  terms: [
    { term: 'Relative humidity', also: ['RH', '%RH'], def: 'The amount of water vapour in the air as a percentage of the most it could hold at the same temperature. It falls when the air is warmed and reaches 100 % at the dew point.' },
    { term: 'Dew point', also: ['condensation temperature'], def: 'The temperature to which air must cool for its water vapour to start condensing. A surface colder than the dew point of the air around it gets wet.' },
    { term: 'Hectopascal', also: ['hPa', 'millibar', 'mbar'], def: 'The usual unit of weather pressure: 1 hPa is 100 Pa, equal to one millibar. Sea-level pressure averages 1013.25 hPa.' },
    { term: 'Self-heating', also: ['sensor warming'], def: 'The warming of a sensor by its own supply current or by neighbouring parts, which shifts its temperature reading and, through it, the humidity reading.' },
    { term: 'Forced mode', also: ['normal mode', 'sleep mode'], def: 'A BME280 or BMP280 setting in which the chip takes one measurement when told to and then sleeps. It uses far less power and heats itself less than continuous (normal) mode.' }
  ],
  choose: {
    good: ['SHT40 or AHT20: accurate, small, quick, from 3.3 V on I2C', 'BME280: humidity, pressure and temperature in one part, with SPI as an option', 'BMP280 or a similar barometer chip where humidity is not needed', 'DHT22 for a slow, simple indoor reading when a library is all you want'],
    avoid: ['DHT11 for anything beyond a demonstration', 'A humidity sensor next to the ESP, a regulator or a power resistor', 'Reading a DHT22 more than once every 2 s', 'Trusting a "BME280" label without reading the chip ID'],
    check: ['The I2C address (0x76 or 0x77) and what else is on the bus', 'That temperature is measured at the same place as humidity', 'Whether the part survives condensation or needs a membrane filter', 'The measurement mode, for power and self-heating']
  },
  formulas: [
    {
      name: 'Height from pressure (standard atmosphere)',
      expr: 'h = 44330*(1 - (p/p0)^(1/5.255))',
      tex: 'h = 44330\\left(1 - \\left(\\frac{p}{p_0}\\right)^{1/5.255}\\right)',
      vars: {
        h: { name: 'height above the reference level', q: 'length', unit: 'm', signed: true, tex: 'h' },
        p: { name: 'measured pressure', q: 'pressure', unit: 'hPa', value: 900, tex: 'p' },
        p0: { name: 'pressure at the reference level (sea level: 1013.25 hPa)', q: 'pressure', unit: 'hPa', value: 1013.25, tex: 'p_0' }
      },
      solveFor: 'h',
      note: 'The standard atmosphere, good to a few metres over a few hundred metres of height. Weather moves the pressure by up to about 30 hPa (250 m), so absolute height from a barometer is only as good as the sea-level pressure you feed it. To correct a station reading to sea level, solve for p0.',
      stories: {
        h: 'A drone\'s barometer reads {p} with sea-level pressure {p0}. How high is it?',
        p0: 'A station at {h} measures {p}. What is the pressure reduced to sea level?'
      }
    },
    {
      name: 'Dew point, rule of thumb',
      expr: 'Td = T - (100 - RH)/5',
      tex: 'T_d \\approx T - \\frac{100 - \\mathrm{RH}}{5}',
      vars: {
        Td: { name: 'dew point', q: 'temperature', unit: '°C', tex: 'T_d' },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T' },
        RH: { name: 'relative humidity in percent', unit: '%', value: 60, min: 50, max: 100, tex: '\\mathrm{RH}' }
      },
      solveFor: 'Td',
      note: 'Within about 1 °C for RH above 50 %. For drier air use the Magnus formula.',
      stories: { Td: 'The air is at {T} and {RH} relative humidity. At what temperature will a cold window start to mist?' }
    }
  ],
  examples: [
    {
      title: 'A weather station on a hill',
      q: 'A BME280 at 500 m above sea level reads 955.0 hPa. What is the pressure reduced to sea level, and is the weather fair?',
      steps: [{ text: 'Reverse the height formula for $p_0$:', tex: 'p_0 = \\frac{p}{\\left(1 - \\frac{h}{44330}\\right)^{5.255}} = \\frac{955.0}{0.98872^{5.255}}' }, 'The power is 0.942, so $p_0 = 955.0 / 0.942 = 1013.7$ hPa.', 'The standard value is 1013.25 hPa: the air is almost exactly average. The reading looked low only because of the height.'],
      a: 'About 1013.7 hPa at sea level — an ordinary day. Without the correction, 955 hPa would have looked like a deep low.'
    }
  ],
  code: [
    {
      title: 'Read a DHT22',
      about: 'Reads temperature and humidity every 2 seconds and says so when the sensor does not answer. The same program runs a DHT11 by changing one word.',
      needs: 'An ESP32 DevKit and a DHT22 module (the three-pin boards have the pull-up on them; a bare four-pin part needs 10 kΩ from data to 3V3).',
      libs: ['DHT sensor library', 'Adafruit Unified Sensor'],
      wiring: [['GPIO4', 'DHT22 data'], ['3V3', 'DHT22 VCC'], ['GND', 'DHT22 GND']],
      blocks: `
        when started
          start serial at (115200) baud

        every (2) seconds
          set [t v] to (DHT22 temperature on pin (4))
          set [h v] to (DHT22 humidity on pin (4))
          if <<(t) is not a number> or <(h) is not a number>> then
            print [DHT22 read failed]
          else
            print (join (t) [ C  ] (h) [ %RH])
          end
      `,
      cpp: String.raw`
        #include <DHT.h>

        const int DHT_PIN = 4;
        DHT dht(DHT_PIN, DHT22);                 // DHT11 for the blue sensor

        void setup() {
          Serial.begin(115200);
          dht.begin();
        }

        void loop() {
          float h = dht.readHumidity();          // % RH, NaN on failure
          float t = dht.readTemperature();       // degrees Celsius
          if (isnan(h) || isnan(t)) Serial.println("DHT22 read failed");
          else Serial.printf("%.1f C  %.1f %%RH\n", t, h);
          delay(2000);                           // the DHT22 needs 2 s between reads
        }
      `,
      py: String.raw`
        from machine import Pin
        import dht, time

        sensor = dht.DHT22(Pin(4))               # dht.DHT11 for the blue sensor

        while True:
            try:
                sensor.measure()                 # raises OSError when the sensor does not answer
                print("%.1f C  %.1f %%RH" % (sensor.temperature(), sensor.humidity()))
            except OSError:
                print("DHT22 read failed")
            time.sleep(2)                        # the DHT22 needs 2 s between reads
      `,
      output: `
        21.8 C  47.3 %RH
        21.8 C  47.2 %RH
      `,
      notes: ['The `dht` module is part of the official MicroPython firmware for the ESP32; no install is needed.', 'Asking sooner than every 2 s gives failed or repeated readings: [[reading-sensors-reliably]] shows how to keep the last good value instead.']
    },
    {
      title: 'An SHT40 without a library',
      about: 'Sends the one-byte "measure" command, waits 10 ms, reads six bytes (two words, each followed by its CRC), checks both CRCs and converts to °C and %RH. It shows what a library does for you.',
      needs: 'An ESP32 DevKit and an SHT40 breakout (address 0x44).',
      wiring: [['GPIO21', 'SHT40 SDA'], ['GPIO22', 'SHT40 SCL'], ['3V3', 'VCC'], ['GND', 'GND']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22)
        every (2) seconds
          I2C write (0xFD) to address (0x44)
          wait (0.01) seconds
          set [d v] to (I2C read (6) bytes from address (0x44))
          if <<(CRC of bytes 1 to 2 of (d)) = (byte 3 of (d))> and <(CRC of bytes 4 to 5 of (d)) = (byte 6 of (d))>> then
            set [t v] to ((-45) + ((175) * ((16-bit value of bytes 1 and 2 of (d)) / (65535))))
            set [rh v] to ((-6) + ((125) * ((16-bit value of bytes 4 and 5 of (d)) / (65535))))
            print (join (t) [ C  ] (rh) [ %RH])
          else
            print [CRC error]
          end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const uint8_t SHT4X = 0x44;

        uint8_t crc8(const uint8_t *d) {         // Sensirion CRC of two bytes: polynomial 0x31, start 0xFF
          uint8_t crc = 0xFF;
          for (int i = 0; i < 2; i++) {
            crc ^= d[i];
            for (int b = 0; b < 8; b++) crc = (crc & 0x80) ? (crc << 1) ^ 0x31 : crc << 1;
          }
          return crc;
        }

        bool readSHT4x(float &tC, float &rh) {
          Wire.beginTransmission(SHT4X);
          Wire.write(0xFD);                      // measure at high precision
          if (Wire.endTransmission() != 0) return false;
          delay(10);                             // the measurement takes about 8 ms
          if (Wire.requestFrom(SHT4X, (size_t)6) != 6) return false;
          uint8_t d[6];
          for (int i = 0; i < 6; i++) d[i] = Wire.read();
          if (crc8(d) != d[2] || crc8(d + 3) != d[5]) return false;   // each word has its own CRC
          tC = -45.0 + 175.0 * ((d[0] << 8) | d[1]) / 65535.0;
          rh = constrain(-6.0 + 125.0 * ((d[3] << 8) | d[4]) / 65535.0, 0.0, 100.0);
          return true;
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(21, 22);
        }

        void loop() {
          float t, rh;
          if (readSHT4x(t, rh)) Serial.printf("%.2f C  %.1f %%RH\n", t, rh);
          else Serial.println("SHT40 read failed");
          delay(2000);
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
        SHT4X = 0x44

        def crc8(data):                          # Sensirion CRC of two bytes: polynomial 0x31, start 0xFF
            crc = 0xFF
            for byte in data:
                crc ^= byte
                for _ in range(8):
                    crc = ((crc << 1) ^ 0x31) & 0xFF if crc & 0x80 else (crc << 1) & 0xFF
            return crc

        def read_sht4x():
            i2c.writeto(SHT4X, b"\xfd")          # measure at high precision
            time.sleep_ms(10)                    # the measurement takes about 8 ms
            d = i2c.readfrom(SHT4X, 6)
            if crc8(d[0:2]) != d[2] or crc8(d[3:5]) != d[5]:   # each word has its own CRC
                raise ValueError("CRC mismatch")
            t = -45 + 175 * ((d[0] << 8) | d[1]) / 65535
            rh = -6 + 125 * ((d[3] << 8) | d[4]) / 65535
            return t, min(100, max(0, rh))

        while True:
            try:
                t, rh = read_sht4x()
                print("%.2f C  %.1f %%RH" % (t, rh))
            except (OSError, ValueError):
                print("SHT40 read failed")
            time.sleep(2)
      `,
      output: `
        21.64 C  46.9 %RH
        21.65 C  46.8 %RH
      `,
      notes: ['The Adafruit SHT4x library does the same in three calls (`begin()`, `getEvent()` for humidity and temperature) if you prefer a library.', 'The SHT40 may read slightly above the room if it sits near the ESP: mount it on a short cable.']
    },
    {
      title: 'Is it a BME280 or a BMP280?',
      about: 'Reads the chip-identification register 0xD0 at address 0x76 and says what answered. A BME280 returns 0x60, a BMP280 0x58.',
      needs: 'An ESP32 DevKit and a board sold as "BME280".',
      wiring: [['GPIO21', 'SDA'], ['GPIO22', 'SCL'], ['3V3', 'VCC'], ['GND', 'GND', 'the SDO pin low gives address 0x76, high gives 0x77']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22)
          set [id v] to (I2C read (1) bytes from address (0x76) register (0xD0))
          if <(id) = (0x60)> then
            print [BME280: humidity, pressure and temperature]
          else if <(id) = (0x58)> then
            print [BMP280: pressure and temperature only, NO humidity]
          else
            print (join [Unknown chip ID 0x] (hex (id)))
          end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const uint8_t ADDR = 0x76;                  // 0x77 when SDO is tied high
        const uint8_t REG_ID = 0xD0;                // the chip-identification register

        uint8_t readReg(uint8_t reg) {
          Wire.beginTransmission(ADDR);
          Wire.write(reg);
          Wire.endTransmission(false);              // repeated start, no STOP
          Wire.requestFrom(ADDR, (size_t)1);
          return Wire.available() ? Wire.read() : 0xFF;
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(21, 22);
          uint8_t id = readReg(REG_ID);
          if (id == 0x60) Serial.println("BME280: humidity, pressure and temperature");
          else if (id >= 0x56 && id <= 0x58) Serial.println("BMP280: pressure and temperature only, NO humidity");
          else Serial.printf("Unknown chip ID 0x%02X\n", id);
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import I2C, Pin

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
        ADDR = 0x76                                 # 0x77 when SDO is tied high
        REG_ID = 0xD0                               # the chip-identification register

        chip_id = i2c.readfrom_mem(ADDR, REG_ID, 1)[0]
        if chip_id == 0x60:
            print("BME280: humidity, pressure and temperature")
        elif 0x56 <= chip_id <= 0x58:
            print("BMP280: pressure and temperature only, NO humidity")
        else:
            print("Unknown chip ID 0x%02X" % chip_id)
      `,
      output: `
        BMP280: pressure and temperature only, NO humidity
      `,
      notes: ['To read the values, use the Adafruit BME280 library in C++ (`Adafruit_BME280 bme; bme.begin(0x76);` then `bme.readTemperature()`, `readHumidity()`, `readPressure()`); MicroPython has no built-in driver, so copy a `bme280.py` file to the board.', 'The Arduino library refuses to start with a chip whose ID it does not know, which is another way of discovering a BMP280.']
    }
  ],
  quiz: [
    { q: 'A DHT22 program reads the sensor every 500 ms and half the readings fail. What is the cause?', choices: ['The pull-up is too small', 'The DHT22 needs at least 2 s between measurements', 'The ESP32 is too fast for it', 'The sensor is a DHT11'], a: 1, why: 'The DHT22 takes about two seconds to produce a new value. Asking sooner returns an error or a repeated number.' },
    { q: 'A humidity sensor sits 1 cm from the ESP32 module and always reads lower than a reference hygrometer. The most likely reason?', choices: ['The sensor is too sensitive', 'The sensor is a few degrees warmer than the room, so the same air looks drier to it', 'Humidity depends on supply voltage', 'The ADC is non-linear'], a: 1, why: 'Relative humidity falls as the air warms. The sensor reports the humidity of the warm air at the board, not of the room.' },
    { q: 'You read register 0xD0 of a "BME280" board and get 0x58. What do you have?', choices: ['A BME280', 'A BMP280: pressure and temperature, no humidity', 'A faulty board', 'A DHT22'], a: 1, why: '0x60 is the BME280 and 0x58 the BMP280. The two share addresses and almost the same look; only the BME280 has a humidity sensor.' },
    { q: 'A weather station at 500 m reads 955 hPa on an ordinary day. The reading is far below 1013 hPa because of a deep low-pressure system.', a: false, why: 'Pressure falls with height, about 1 hPa per 8 m: 500 m gives about 60 hPa less. Corrected to sea level the reading is about 1013.7 hPa.' }
  ],
  applications: [
    'Weather stations: temperature, humidity and pressure from one BME280 on a cable, sent over Wi-Fi or ESP-NOW.',
    'Greenhouses, cellars and humidors, where a humidifier or fan switches on a humidity threshold with hysteresis.',
    'Condensation warnings: switch a heater or fan when a surface temperature approaches the dew point of the room.',
    'Barometric altimeters in drones and fitness trackers, and floor detection in buildings.'
  ],
  sources: [
    'Sensirion, *SHT4x datasheet*: the measure command 0xFD, the conversion formulas and the CRC.',
    'Bosch Sensortec, *BME280 datasheet*: modes (sleep, forced, normal), the ID register, accuracy and relative accuracy of pressure.',
    'Aosong, *AM2302 (DHT22) datasheet*: sampling period of 2 s, accuracy and the 40-bit single-wire protocol.'
  ],
  sim: 'sw-rh'
}
,

/* ================================================================ light-sensors */
{
  id: 'light-sensors',
  parent: 'sensing-the-world',
  title: 'Light: BH1750, TSL2591, photodiodes',
  level: 1,
  short: 'How bright is it? A BH1750 answers in lux over I2C, a TSL2591 covers twilight to daylight, and a light-dependent resistor is the cheapest dusk switch. The traps are range, position and the flicker of lamps.',
  keywords: ['light', 'lux', 'illuminance', 'BH1750', 'TSL2591', 'LDR', 'photoresistor', 'photodiode', 'phototransistor', 'TCS34725', 'colour sensor', 'UV', 'ambient light', 'night light', 'hysteresis', 'integration time', 'automatic brightness'],
  prereq: ['choosing-a-sensor', 'i2c', 'thermistors-and-ldrs'],
  related: ['reading-sensors-reliably', 'driving-leds-with-pwm', 'backlight-and-power', 'i2c-addresses-and-scanning', 'electronics:photodiodes', 'physics:light-intensity'],
  body: `Light sensors answer one of three questions: how bright is it, what colour is it, or is it simply light or dark. For brightness the unit is the **lux** (lx): light falling on a surface, weighted by how the eye sees. It spans eight orders of magnitude, which is why sensor ranges matter so much.

| Place | Illuminance |
|---|---|
| Clear night, full moon | 0.1–0.3 lx |
| Living room in the evening | 50–200 lx |
| Office desk | 300–500 lx |
| Overcast day, outdoors | 1 000–10 000 lx |
| Direct summer sun | about 100 000 lx |

### The parts

- **BH1750** (I2C 0x23, or 0x5C with the ADDR pin high): a 16-bit digital sensor, 1 to 65 535 lx, and lux = raw ÷ 1.2. Continuous high-resolution mode gives 1 lx steps (a 0.5 lx mode exists) in about 120 ms; it follows the eye's colour response fairly well. In its default setting it clips near 54 600 lx, so direct sun saturates it.
- **TSL2591** (0x29): two photodiodes, one seeing visible plus infrared, one infrared only, with gain and integration time from 100 to 600 ms: 188 µlx to 88 000 lx. The part for dark rooms and the night sky.
- **Light-dependent resistor** (LDR, a cadmium-sulphide cell): resistance falls with light. In a divider on an ADC pin it is the cheapest dusk switch, slow (tens of ms), strongly non-linear and different from part to part — never a measuring instrument.
- **Photodiode or phototransistor:** a current proportional to light, fast, but it wants an amplifier or load resistor; used in remote-control receivers, sun trackers and flicker detectors.
- **Colour (TCS34725, 0x29)** and **UV** sensors (analogue GUVA-S12SD, I2C VEML6075) exist; UV figures are rough.

Note the address 0x29: the TSL2591, TCS34725, VL53L0X and BNO055 all use it. Two of them on one bus clash ([[i2c-addresses-and-scanning]]).

### Traps

- **Position.** Behind a window, a diffuser or a case, readings drop; face the sensor at the light and screen it from the board's own LEDs.
- **Flicker.** PWM-dimmed LEDs and mains lamps flicker at 100–120 Hz; a fast reading can catch the dark part. Average at least 100 ms.
- **Light sources differ.** A sensor's spectral response differs from the eye's, so sunlight, LED and filament lamps read differently.
- **Feedback.** An automatic lamp lights its own sensor. Use two thresholds (hysteresis), as in the program, or it flickers on and off.

> [!key] Light is measured in lux over eight decades; choose a sensor whose range covers your scene, mount it facing the light, average over lamp flicker, and give any automatic lamp two thresholds so that it does not blink on its own light.`,
  ideas: [
    'Illuminance in lux runs from 0.1 at night to 100 000 in sun; a sensor must have the range for the scene.',
    'The BH1750 gives lux over I2C as raw ÷ 1.2 and clips near 54 600 lx at default settings.',
    'An LDR is the cheapest dusk switch but slow, non-linear and unrepeatable.',
    'A lamp controlled by its own light sensor needs hysteresis or it flickers.'
  ],
  pitfalls: [
    'More lux resolution means a better sensor — The range matters as much: a 1 lx step is useless in direct sun, and a sensor that clips at 54 600 lx cannot see a bright day.',
    'An LDR measures light in lux — It gives a resistance that depends on the part, the temperature and its history; it can tell light from dark, not 300 lx from 500 lx.',
    'Two sensors on one I2C bus always work — The TSL2591, TCS34725 and VL53L0X all answer at 0x29: only one of them can share a bus without changing an address.'
  ],
  terms: [
    { term: 'Lux', also: ['lx', 'illuminance'], def: 'The unit of illuminance: light arriving on a surface, weighted by the sensitivity of the human eye. One lux is one lumen per square metre.' },
    { term: 'Photodiode', also: ['phototransistor'], def: 'A diode that passes a small current proportional to the light on it. It is fast and linear but needs a resistor or amplifier to turn the current into a voltage.' },
    { term: 'Light-dependent resistor', also: ['LDR', 'photoresistor', 'CdS cell'], def: 'A resistor whose value falls from megohms in the dark to a few kilohms in bright light. Cheap, slow and imprecise.' },
    { term: 'Integration time', also: ['exposure time'], def: 'How long a light sensor collects light before reporting. A longer time sees dimmer light and averages out flicker, but answers more slowly.' },
    { term: 'Spectral response', also: ['photopic response'], def: 'How strongly a sensor reacts to each colour. A sensor whose response differs from the eye\'s reads different lux values under different kinds of lamp.' }
  ],
  choose: {
    good: ['BH1750: indoor and daylight levels in lux with no calibration, over I2C', 'TSL2591: very dark scenes up to daylight, or when the infrared part matters', 'An LDR with hysteresis: dusk switches and "is the light on" checks', 'A photodiode: fast light detection such as beams and remote-control receivers'],
    avoid: ['An LDR as a measuring instrument', 'A BH1750 in direct sun at default settings: it clips', 'Placing the sensor where the lamp it controls shines on it', 'Two 0x29 sensors on one bus without an address plan'],
    check: ['The range and the gain or integration settings against the scene', 'The window or diffuser in front of the sensor', 'Lamp flicker against your measurement time', 'The address, and what else is on the bus']
  },
  examples: [
    {
      title: 'Will it clip in the sun?',
      q: 'A BH1750 is in its default mode and reads raw = 65 535. Is that 65 535 lx? What is the brightest scene it can show, and what should you suspect on a bright day?',
      steps: ['The sensor reports raw counts, and the datasheet conversion is lux = raw ÷ 1.2.', 'The largest raw value, 65 535, is therefore $65\\,535 / 1.2 \\approx 54\\,600$ lx.', 'Direct summer sun is around 100 000 lx, so the sensor is saturated: it cannot tell 60 000 from 100 000 lx.'],
      a: 'No: 65 535 counts is about 54 600 lx, the sensor\'s ceiling. A bright day will clip; use a lower-sensitivity setting, a diffuser, or a sensor with a wider range for outdoor sun.'
    }
  ],
  code: [
    {
      title: 'Light level and a night light with two thresholds',
      about: 'Reads a BH1750 twice a second and prints lux. A lamp switches on below 20 lx and off above 40 lx: the gap between the two thresholds keeps it from flickering when the lamp lights its own sensor.',
      needs: 'An ESP32 DevKit, a BH1750 breakout and an LED with a 220 Ω resistor (or the on-board LED on GPIO2).',
      wiring: [['GPIO21', 'BH1750 SDA'], ['GPIO22', 'BH1750 SCL'], ['3V3', 'BH1750 VCC'], ['GND', 'BH1750 GND and ADDR', 'ADDR low: address 0x23'], ['GPIO2', '220 Ω → LED → GND']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22)
          set pin (2) as [output v]
          set [lamp v] to <false>
          I2C write (0x01) to address (0x23)    // power on
          I2C write (0x10) to address (0x23)    // continuous measurement, 1 lx steps
          wait (0.18) seconds
        every (0.5) seconds
          set [lux v] to ((16-bit value of (I2C read (2) bytes from address (0x23))) / (1.2))
          if <(lux) < (20)> then
            set [lamp v] to <true>
          else if <(lux) > (40)> then
            set [lamp v] to <false>
          end
          set pin (2) to (lamp)
          print (join (round (lux)) [ lx])
      `,
      cpp: String.raw`
        #include <Wire.h>

        const uint8_t BH1750 = 0x23;                 // 0x5C when the ADDR pin is high
        const int LAMP = 2;
        const float DARK_BELOW = 20, LIGHT_ABOVE = 40;   // lux: two thresholds, so the lamp does not flicker
        bool lampOn = false;

        void command(uint8_t c) {
          Wire.beginTransmission(BH1750);
          Wire.write(c);
          Wire.endTransmission();
        }

        float readLux() {
          if (Wire.requestFrom(BH1750, (size_t)2) != 2) return -1;
          uint8_t hi = Wire.read();                  // two reads in one expression have no fixed order
          uint8_t lo = Wire.read();
          return ((hi << 8) | lo) / 1.2;             // the datasheet's conversion
        }

        void setup() {
          Serial.begin(115200);
          pinMode(LAMP, OUTPUT);
          Wire.begin(21, 22);
          command(0x01);                             // power on
          command(0x10);                             // continuous measurement, 1 lx steps
          delay(180);                                // wait for the first measurement
        }

        void loop() {
          float lux = readLux();
          if (lux < 0) {
            Serial.println("BH1750 not answering");
          } else {
            if (lux < DARK_BELOW) lampOn = true;
            else if (lux > LIGHT_ABOVE) lampOn = false;
            digitalWrite(LAMP, lampOn);
            Serial.printf("%.0f lx  lamp %s\n", lux, lampOn ? "on" : "off");
          }
          delay(500);
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
        BH1750 = 0x23                                # 0x5C when the ADDR pin is high
        lamp = Pin(2, Pin.OUT)
        DARK_BELOW, LIGHT_ABOVE = 20, 40             # lux: two thresholds, so the lamp does not flicker
        lamp_on = False

        i2c.writeto(BH1750, b"\x01")                 # power on
        i2c.writeto(BH1750, b"\x10")                 # continuous measurement, 1 lx steps
        time.sleep_ms(180)                           # wait for the first measurement

        while True:
            try:
                raw = int.from_bytes(i2c.readfrom(BH1750, 2), "big")
                lux = raw / 1.2                      # the datasheet's conversion
                if lux < DARK_BELOW:
                    lamp_on = True
                elif lux > LIGHT_ABOVE:
                    lamp_on = False
                lamp.value(lamp_on)
                print("%.0f lx  lamp %s" % (lux, "on" if lamp_on else "off"))
            except OSError:
                print("BH1750 not answering")
            time.sleep_ms(500)
      `,
      output: `
        312 lx  lamp off
        14 lx  lamp on
        27 lx  lamp on
        55 lx  lamp off
      `,
      notes: ['At 27 lx the lamp stays on: between the two thresholds the lamp keeps its previous state. That is the point of hysteresis ([[on-off-control-and-hysteresis]]).', 'The BH1750 can be read as soon as 120 ms after the command in this mode; reading faster returns the old value again.']
    }
  ],
  quiz: [
    { q: 'A BH1750 in default mode shows 65 535 counts. What does that mean?', choices: ['65 535 lx exactly', 'About 54 600 lx, the top of its range: it may be saturated', 'A wiring fault', 'Darkness'], a: 1, why: 'lux = raw ÷ 1.2, so the full-scale count is about 54 600 lx. A bright scene can be well beyond that, and the sensor cannot tell how far.' },
    { q: 'A garden lamp switches on below 30 lx and off above 30 lx, using a sensor next to it. What happens at dusk?', choices: ['It switches on cleanly', 'It flickers: its own light pushes the reading over the threshold, switching it off, then back on', 'It never switches on', 'The ESP32 resets'], a: 1, why: 'With a single threshold the lamp lights its own sensor, the reading crosses the threshold, the lamp goes out, and the cycle repeats. Two thresholds (hysteresis) stop it.' },
    { q: 'Which pair of parts cannot share one I2C bus at their default addresses?', choices: ['BH1750 (0x23) and BME280 (0x76)', 'TSL2591 (0x29) and VL53L0X (0x29)', 'SHT40 (0x44) and BH1750 (0x23)', 'SCD40 (0x62) and MPU6050 (0x68)'], a: 1, why: 'Both answer at 0x29. The other pairs have different addresses. Some parts let you move their address; the TSL2591 does not.' },
    { q: 'An LDR in a divider is a good way to read light in lux.', a: false, why: 'LDRs vary from part to part, with temperature and with how long they were in the dark. They can switch a lamp at dusk, but they cannot give a lux value without calibration of that individual cell.' }
  ],
  applications: [
    'Automatic brightness of displays and LED strips, with a logarithmic mapping because the eye sees brightness in ratios.',
    'Dusk-to-dawn lamps and shutters, with hysteresis.',
    'Greenhouse and houseplant monitoring: daily light integral over a day.',
    'Photography tools: exposure meters and time-lapse cameras that change settings with the light.'
  ],
  sources: [
    'ROHM Semiconductor, *BH1750FVI digital 16-bit serial output ambient light sensor* datasheet: commands, measurement modes and the conversion factor 1.2.',
    'ams OSRAM, *TSL2591 high dynamic range digital light sensor* datasheet: gain, integration time and range.',
    'EN 12464-1, *Light and lighting: lighting of work places*: the recommended illuminance for desks and rooms.'
  ]
}
,

/* ================================================================ distance-sensors */
{
  id: 'distance-sensors',
  parent: 'sensing-the-world',
  title: 'Distance: ultrasonic and time-of-flight',
  level: 1,
  short: 'Send a sound or a light pulse and time its return: distance is time times speed, halved. The HC-SR04 does it with ultrasound for little money; the VL53L0X does it with a laser on I2C. Each is fooled by different surfaces.',
  keywords: ['distance', 'ultrasonic', 'HC-SR04', 'JSN-SR04T', 'echo', 'trigger', 'time of flight', 'ToF', 'VL53L0X', 'VL53L1X', 'LiDAR', 'speed of sound', 'pulseIn', 'time_pulse_us', 'range finder', 'level sensing', 'obstacle'],
  prereq: ['choosing-a-sensor', 'three-volt-logic', 'voltage-dividers-for-inputs'],
  related: ['pulse-counting', 'measuring-frequency-and-time', 'soil-and-water-sensors', 'presence-and-motion-sensors', 'reading-sensors-reliably', 'project-robot-car', 'physics:speed-of-sound', 'physics:ultrasound'],
  body: `Two ideas measure distance on an ESP: send a sound and time its echo, or send a pulse of light and time its return. Both measure a *time* and turn it into a distance with a speed.

### Ultrasonic: the HC-SR04

The module has a small speaker and microphone tuned to 40 kHz. A 10 µs pulse on TRIG makes it send eight bursts of sound; the ECHO pin then goes high and stays high until the echo comes back. The width of that pulse is the round trip, so the distance is $d = c\\,t/2$. With c = 343 m/s at 20 °C, each centimetre of distance costs 58 µs of echo. Range: about 2 cm to 4 m, in a cone of roughly 15°. It runs from **5 V** (about 15 mA) and its echo pin outputs **5 V**: put a divider ([[voltage-dividers-for-inputs]]) between it and the ESP32, or buy a 3.3 V version (HC-SR04P, RCWL-1601).

- **The speed of sound changes with temperature**: 331 m/s at 0 °C, 343 at 20 °C, 352 at 35 °C. Ignoring it costs about 3.5 % between 0 °C and 20 °C.
- **Surfaces matter.** Hard, flat targets facing the sensor work; cloth, foam, fur and steep slopes swallow or deflect the sound.
- **Wait 60 ms or more between pings**, or a late echo is taken for the next one; two sensors firing together hear each other.
- **The waterproof JSN-SR04T** has a separate probe, a blind zone of 20 cm or more, and suits tanks.

### Time of flight: VL53L0X and relatives

A time-of-flight sensor fires infrared laser pulses and measures how long the light takes to return. The VL53L0X (I2C 0x29) reads from about 3 cm to roughly 1.2 m in its default mode (up to about 2 m when set for long range in dim light); the VL53L1X reaches about 4 m. It sees soft surfaces ultrasound cannot, but clear glass and mirrors fool it, black surfaces absorb the light, and strong sunlight shortens the range. Each reading carries a status: check it. Every part starts at address 0x29; to use several, hold the others in reset with their XSHUT pins and give each a new address in turn ([[i2c-addresses-and-scanning]]).

| | HC-SR04 | VL53L0X |
|---|---|---|
| Principle | sound echo | laser pulse |
| Range | 2–400 cm | 3 cm to about 1.2 m |
| Connection | trigger and echo pins | I2C |
| Supply | 5 V | 2.6–3.5 V |
| Fooled by | soft or slanted surfaces, temperature | glass, mirrors, sunlight |

[The simulation](#/c/distance-sensors?s=sim) shows a ping, its echo and what a wrong temperature does.

> [!key] Distance is half the echo time times the speed of the wave: 58 µs per centimetre for sound at 20 °C. Ultrasound is cheap and wide but needs a 5 V divider and a temperature correction; time of flight is a small I2C part that sees soft things and is fooled by glass and sun.`,
  ideas: [
    'Both families measure a time and multiply by a speed, halving it for the round trip.',
    'The HC-SR04 is a 5 V part: its echo pin needs a divider before an ESP32 input.',
    'The speed of sound rises about 0.6 m/s per °C, so a distance without temperature correction can be off by 3 %.',
    'Ultrasound is fooled by soft and slanted surfaces, time of flight by glass, mirrors and sunlight.'
  ],
  pitfalls: [
    'The ESP32 pin can take the 5 V echo for a moment — Nothing makes the pin 5 V tolerant; the clamp diodes carry current they were never meant to. Use a divider or a level shifter.',
    'The echo time gives the distance directly — It is the round trip: half the time times the speed of sound is the distance.',
    'Ultrasound measures any object in front of it — Cloth, foam and sloping surfaces send the sound elsewhere, and the sensor reports no echo or a distant wall behind.'
  ],
  terms: [
    { term: 'Time of flight', also: ['ToF'], def: 'Measuring a distance by timing how long a pulse of sound or light takes to travel to a target and back, then multiplying by its speed and halving the result.' },
    { term: 'Echo pulse', also: ['ECHO', 'TRIG'], def: 'On an HC-SR04, the pin that goes high for as long as the sound takes to return; its width in microseconds, divided by 58, is the distance in centimetres at 20 °C.' },
    { term: 'Speed of sound', also: ['c'], def: 'About 343 m/s in air at 20 °C, rising by about 0.6 m/s for each degree. It sets the scale of every ultrasonic distance measurement.' },
    { term: 'Blind zone', also: ['dead zone', 'minimum range'], def: 'The range close to an ultrasonic sensor in which it cannot measure, because the echo returns while it is still sending or ringing: 2 cm for an HC-SR04, 20 cm or more for a waterproof probe.' },
    { term: 'XSHUT', also: ['shutdown pin'], def: 'The pin of a VL53L0X or VL53L1X that holds the chip in reset. Pulling all but one low lets you give each sensor on a shared bus its own I2C address in turn.' }
  ],
  choose: {
    good: ['HC-SR04 (or the 3.3 V HC-SR04P): cheap obstacle and level sensing indoors', 'JSN-SR04T: tank levels, outdoors, where a sealed probe is needed', 'VL53L0X / VL53L1X: small, quick, on I2C, for soft or small targets and gestures', 'A LiDAR module such as the TF-Luna for several metres outdoors'],
    avoid: ['A 5 V echo wired straight to a GPIO', 'Ultrasound on cloth, foam or steeply sloped targets', 'Time of flight behind glass or pointing at a window', 'Pinging faster than every 60 ms, or two sensors at once'],
    check: ['The temperature, for a corrected speed of sound', 'The blind zone against your minimum distance', 'The status flag with every time-of-flight reading', 'The beam cone against clutter at the side']
  },
  formulas: [
    {
      name: 'Speed of sound in air',
      expr: 'c = 331.3*sqrt(T/273.15)',
      tex: 'c = 331.3\\sqrt{\\frac{T}{273.15}}',
      vars: {
        c: { name: 'speed of sound', q: 'speed', unit: 'm/s', tex: 'c' },
        T: { name: 'air temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T' }
      },
      solveFor: 'c',
      note: 'For dry air, with T in kelvin inside the formula (the calculator converts). Humidity adds a fraction of a per cent.',
      stories: { c: 'The air is at {T}. How fast does sound travel in it?' }
    },
    {
      name: 'Distance from the echo time',
      expr: 'd = c*t/2',
      tex: 'd = \\frac{c\\,t}{2}',
      vars: {
        d: { name: 'distance to the target', q: 'length', unit: 'cm', tex: 'd' },
        c: { name: 'speed of sound (or of light for a laser)', q: 'speed', unit: 'm/s', value: 343, tex: 'c' },
        t: { name: 'round-trip time (the echo pulse width)', q: 'time', unit: 'µs', value: 5830, tex: 't' }
      },
      solveFor: 'd',
      note: 'The sound travels there and back, hence the factor 2. For light the same formula holds with c = 3 × 10⁸ m/s — and times a million times shorter.',
      stories: { d: 'An HC-SR04 echo pulse lasts {t} in air where sound travels at {c}. How far is the object?', t: 'A target is {d} away and sound travels at {c}. How long is the echo pulse?' }
    }
  ],
  examples: [
    {
      title: 'A tank that read too far in winter',
      q: 'A program assumes 343 m/s. On a 5 °C morning it reports a water surface 3.00 m below an HC-SR04. How far is the surface really?',
      steps: [{ text: 'The speed of sound at 5 °C is', tex: 'c = 331.3\\sqrt{\\tfrac{278.15}{273.15}} = 334.3\\ \\mathrm{m/s}' }, 'The program turned the echo time $t$ into a distance with 343 m/s, so it read $343\\,t/2 = 3.00$ m. The true distance is $334.3\\,t/2$.', { text: 'Scaling:', tex: '3.00\\ \\mathrm{m}\\times\\frac{334.3}{343} = 2.92\\ \\mathrm{m}' }],
      a: 'The surface is 2.92 m away: the uncorrected program is 8 cm too long. Measuring the air temperature (a DS18B20 will do) and using the formula removes it.'
    }
  ],
  code: [
    {
      title: 'An HC-SR04 with a corrected speed of sound',
      about: 'Sends the 10 µs trigger, times the echo pulse, and converts it to centimetres with the speed of sound at the stated air temperature. Gives up after 30 ms, which is about 5 m.',
      needs: 'An ESP32 DevKit, an HC-SR04 (5 V) and a divider for the echo line: 1.8 kΩ in series, 3.3 kΩ to ground.',
      wiring: [['GPIO25', 'HC-SR04 TRIG', 'a 3.3 V trigger is enough'], ['GPIO26', 'HC-SR04 ECHO through 1.8 kΩ', '3.3 kΩ from the pin to GND'], ['5V (VIN)', 'HC-SR04 VCC'], ['GND', 'HC-SR04 GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (25) as [output v]
          set pin (26) as [input v]
        every (0.1) seconds
          set pin (25) to [HIGH v]
          wait (0.00001) seconds
          set pin (25) to [LOW v]
          set [us v] to (width of the HIGH pulse on pin (26), give up after (30000) µs)
          if <(us) = (0)> then
            print [no echo]
          else
            set [c v] to ((331.3) * (square root of (((273.15) + (20)) / (273.15))))
            print (join (round (((us) * (c)) / (20000))) [ cm])
          end
      `,
      cpp: String.raw`
        const int TRIG = 25, ECHO = 26;           // ECHO through a 1.8 kΩ / 3.3 kΩ divider
        const float TEMP_C = 20.0;                // air temperature: read a real sensor to do better

        void setup() {
          Serial.begin(115200);
          pinMode(TRIG, OUTPUT);
          pinMode(ECHO, INPUT);
          digitalWrite(TRIG, LOW);
        }

        float readDistanceCm() {
          digitalWrite(TRIG, HIGH);
          delayMicroseconds(10);                  // a 10 µs trigger pulse
          digitalWrite(TRIG, LOW);
          unsigned long us = pulseIn(ECHO, HIGH, 30000);    // echo width; 0 after 30 ms: no echo
          if (us == 0) return -1;
          float c = 331.3 * sqrt((273.15 + TEMP_C) / 273.15);   // speed of sound in m/s
          return us * 1e-6 * c / 2 * 100;         // time x speed / 2, in centimetres
        }

        void loop() {
          float d = readDistanceCm();
          if (d < 0) Serial.println("no echo");
          else Serial.printf("%.1f cm\n", d);
          delay(100);                             // let the last echo die away
        }
      `,
      py: String.raw`
        from machine import Pin, time_pulse_us
        import time, math

        trig = Pin(25, Pin.OUT, value=0)
        echo = Pin(26, Pin.IN)                    # through a 1.8 kΩ / 3.3 kΩ divider
        TEMP_C = 20.0                             # air temperature: read a real sensor to do better

        def read_distance_cm():
            trig.value(1)
            time.sleep_us(10)                     # a 10 µs trigger pulse
            trig.value(0)
            us = time_pulse_us(echo, 1, 30000)    # echo width; negative on a time-out
            if us < 0:
                return None
            c = 331.3 * math.sqrt((273.15 + TEMP_C) / 273.15)   # speed of sound in m/s
            return us * 1e-6 * c / 2 * 100        # time x speed / 2, in centimetres

        while True:
            d = read_distance_cm()
            print("no echo" if d is None else "%.1f cm" % d)
            time.sleep_ms(100)                    # let the last echo die away
      `,
      output: `
        100.0 cm
        100.1 cm
        no echo
      `,
      notes: ['`pulseIn` and `time_pulse_us` wait in a loop for up to 30 ms. For a program that must stay responsive, time the echo with an interrupt or the pulse counter ([[pulse-counting]]).', 'Readings jump when the target is slanted or soft. Take the median of five ([[reading-sensors-reliably]]).']
    }
  ],
  quiz: [
    { q: 'An HC-SR04 echo pulse is 11.66 ms wide at 20 °C. How far is the target?', choices: ['0.5 m', '1 m', '2 m', '4 m'], a: 2, why: '11.66 ms × 343 m/s = 4.0 m for the round trip, so the target is 2.0 m away. (Equivalently, 11 660 µs ÷ 58 = 201 cm.)' },
    { q: 'Why does an HC-SR04 powered from 5 V need a divider on its echo pin?', choices: ['To slow the pulse down', 'The echo is a 5 V signal and the ESP32 pin is a 3.3 V part', 'To make the pulse wider', 'The echo is analogue'], a: 1, why: 'The module outputs its own supply voltage on ECHO. An ESP32 input is not 5 V tolerant; a 1.8 kΩ / 3.3 kΩ divider gives about 3.2 V.' },
    { q: 'You aim an ultrasonic sensor at a thick curtain, then at a glass door. Which does a time-of-flight laser sensor handle better, and which does an ultrasonic one?', choices: ['Both are fine for both', 'Ultrasonic: curtain; laser: glass', 'Ultrasonic: glass; laser: curtain', 'Neither works on either'], a: 2, why: 'Hard glass reflects sound well but passes laser light; a curtain swallows sound but reflects the laser diffusely. The two methods fail on opposite surfaces.' },
    { q: 'The speed of sound is the same on a winter morning and a summer afternoon, so no correction is needed.', a: false, why: 'It rises about 0.6 m/s per degree: 331 m/s at 0 °C and 352 m/s at 35 °C, a swing of about 6 % — roughly 3 % either side of 343 m/s.' }
  ],
  applications: [
    'Parking aids and obstacle sensing for small robots ([[project-robot-car]]).',
    'Level sensing of water, grain and fuel tanks from above, with a sealed probe.',
    'Hand and gesture detection: a VL53L0X triggers a tap or a soap dispenser.',
    'People and parcel counting on conveyors and in doorways.'
  ],
  sources: [
    'Elecfreaks / Cytron, *HC-SR04 ultrasonic ranging module* datasheet: trigger pulse, echo timing and range.',
    'STMicroelectronics, *VL53L0X datasheet*: the time-of-flight principle, ranging modes and the status flags.',
    'MicroPython documentation, `machine.time_pulse_us`; Arduino core documentation, `pulseIn`.'
  ],
  sim: 'sw-ping'
}
,

/* ================================================================ presence-and-motion-sensors */
{
  id: 'presence-and-motion-sensors',
  parent: 'sensing-the-world',
  title: 'Presence: PIR and millimetre-wave radar',
  level: 1,
  short: 'Is anyone there? A PIR sensor notices warm bodies that move and costs microamps; a 24 GHz radar module notices people sitting still but draws tens of milliamps. Hold times, warm-up and what each one cannot see decide the design.',
  keywords: ['presence', 'PIR', 'passive infrared', 'HC-SR501', 'AM312', 'motion detector', 'occupancy', 'radar', 'mmWave', 'LD2410', 'hold time', 'retrigger', 'warm-up', 'RCWL-0516', 'thermal array', 'AMG8833', 'wake on motion'],
  prereq: ['choosing-a-sensor', 'digital-input', 'uart'],
  related: ['wake-up-sources', 'motion-sensors-imu', 'distance-sensors', 'on-off-control-and-hysteresis', 'project-ble-presence', 'cameras-and-the-law'],
  body: `"Is anyone there?" is a different question from "how far away is it?". Two sensor families answer it: passive infrared (PIR), which notices *movement* of warm bodies, and millimetre-wave radar, which notices a person even when still.

### PIR: passive infrared

A PIR sensor sends nothing out. A pyroelectric element behind a faceted lens reacts to a *change* in infrared as a warm body crosses from one zone of the lens to the next. The output is a plain digital pin.

- **HC-SR501:** 5 V supply (4.5–20 V), 3.3 V logic output, safe for an ESP32, about 65 µA idle. Two potentiometers set the range (roughly 3–7 m) and the *hold time*, from a few seconds to minutes; a jumper picks repeatable or single-trigger mode.
- **AM312 mini PIR:** runs from 3.3 V, draws a few microamps, holds its output for about 2 s, and has no adjustments: the choice for a battery sensor that wakes the ESP32 from deep sleep ([[wake-up-sources]]).
- **Warm-up:** for 30–60 s after power-on the output fires at random. Ignore it.
- **Hold and block time:** in *repeatable* mode every new movement restarts the hold, so the output stays high while someone moves; in *single-trigger* mode it goes high once for the hold time, ignores movement, then pauses for about 2.5 s ([the simulation](#/c/presence-and-motion-sensors?s=sim)).
- **Blind spots:** a person sitting still *disappears*; sun on a wall, heaters and vents trigger it; glass blocks far infrared, so a PIR behind a window sees nothing outside.

### Millimetre-wave radar: the LD2410 class

A 24 GHz radar module detects moving people and, through breathing and small movements, *stationary* ones. It reports distance in gates of about 0.75 m out to roughly 6 m, over a UART (256 000 baud by default) with an extra OUT pin for plain presence. It needs 5 V and about 80 mA, with 3.3 V signals. It sees through thin plastic and plasterboard; fans, curtains and pets can trigger it, and each gate's sensitivity can be tuned from a phone app. It is a radio transmitter: use a certified module and check your country's rules ([[transmit-power-and-regulations]]). It records no picture, which makes it friendlier than a camera.

### Choosing

| Need | Choose |
|---|---|
| Wake a battery device on movement | AM312 or HC-SR501 on an ext0 wake pin |
| "Is the room occupied?" with people sitting | LD2410 radar |
| How many people, and where | a thermal array such as the AMG8833 (8 × 8 pixels, I2C 0x69) |
| Cheapest | RCWL-0516 microwave: sees through walls, easily false-triggered |

Whatever the sensor, the program decides *occupied* with its own timer: occupied from the first detection until some minutes after the last.

> [!key] A PIR is a microamp motion detector that cannot see people who sit still; a 24 GHz radar sees them but costs tens of milliamps. Ignore the warm-up, understand the hold and block times, and let the program, not the sensor, decide when a room is empty.`,
  ideas: [
    'A PIR reacts to a change in infrared, so it sees movement of warm bodies and loses people who sit still.',
    'HC-SR501 and AM312 modules output a 3.3 V digital level; the hold time and the retrigger mode decide how long and how often.',
    'A radar module such as the LD2410 sees stationary people and reports distance over a UART, at about 80 mA from 5 V.',
    'The program, not the sensor, should decide "occupied": from the first detection until a timeout after the last.'
  ],
  pitfalls: [
    'The PIR says the room is empty, so nobody is there — A person reading or sleeping makes no movement across the lens zones. Add a hold of minutes, or use radar.',
    'The PIR works through a window — Glass blocks far infrared. The sensor must look into the room through plastic made for it, not through glass.',
    'The output toggling in the first minute is a fault — It is the warm-up: the sensor settles for 30–60 s. Ignore its output until then.'
  ],
  terms: [
    { term: 'PIR sensor', also: ['passive infrared', 'pyroelectric sensor'], def: 'A sensor that detects changes in infrared radiation from warm bodies moving across the zones of its lens. It emits nothing and draws only microamps.' },
    { term: 'Hold time', also: ['delay time', 'retrigger', 'block time'], def: 'How long a PIR output stays high after a detection. In repeatable mode new movement restarts the hold; in single-trigger mode it is ignored until the hold ends.' },
    { term: 'mmWave radar', also: ['LD2410', 'FMCW radar', '24 GHz radar'], def: 'A radar working at millimetre wavelengths, such as the 24 GHz LD2410 module, which detects moving and stationary people and reports their distance.' },
    { term: 'Distance gate', also: ['range gate'], def: 'One of the equal slices of distance (about 0.75 m on an LD2410) into which a radar divides its range, each with its own sensitivity setting.' },
    { term: 'Occupancy', also: ['presence'], def: 'The program\'s belief that someone is in a space: set at the first detection and cleared when nothing has been detected for a chosen time.' }
  ],
  choose: {
    good: ['AM312: tiny battery motion sensor that wakes the ESP32 from deep sleep', 'HC-SR501: adjustable hold and range for lights and alarms from 5 V', 'LD2410: occupancy of rooms where people sit or sleep', 'A thermal array: counting and locating people without a camera'],
    avoid: ['PIR for "is anyone in the room?" with still people', 'PIR behind glass, or aimed at a radiator or a sunny wall', 'A radar module on a coin cell', 'RCWL-0516 where false triggers matter'],
    check: ['The warm-up time before the output means anything', 'The hold time and the retrigger jumper against your logic', 'The supply: 5 V for HC-SR501 and LD2410, with 3.3 V signals', 'Local rules for a 24 GHz transmitter']
  },
  code: [
    {
      title: 'Occupied until a minute after the last movement',
      about: 'Ignores the PIR for its first 30 s, then keeps an *occupied* flag raised until 60 s have passed without a detection. Prints each change.',
      needs: 'An ESP32 DevKit and an HC-SR501 PIR module (5 V supply, 3.3 V output).',
      wiring: [['GPIO27', 'PIR OUT'], ['5V (VIN)', 'PIR VCC'], ['GND', 'PIR GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (27) as [input v]
          set [last v] to (milliseconds since start)
          set [occupied v] to <false>
        forever
          if <<(milliseconds since start) ≥ (30000)> and <(read pin (27)) = [HIGH v]>> then
            set [last v] to (milliseconds since start)
            if <not <occupied>> then
              set [occupied v] to <true>
              print [occupied]
            end
          end
          if <<occupied> and <((milliseconds since start) - (last)) ≥ (60000)>> then
            set [occupied v] to <false>
            print [empty]
          end
        end
      `,
      cpp: String.raw`
        const int PIR_PIN = 27;                       // HC-SR501 output: 3.3 V logic
        const uint32_t WARM_UP_MS = 30000;            // ignore the output while the sensor settles
        const uint32_t HOLD_MS = 60000;               // occupied until this long after the last movement
        uint32_t lastMotion = 0;
        bool occupied = false;

        void setup() {
          Serial.begin(115200);
          pinMode(PIR_PIN, INPUT);
        }

        void loop() {
          uint32_t now = millis();
          if (now >= WARM_UP_MS && digitalRead(PIR_PIN) == HIGH) {
            lastMotion = now;
            if (!occupied) {
              occupied = true;
              Serial.println("occupied");
            }
          }
          if (occupied && now - lastMotion >= HOLD_MS) {
            occupied = false;
            Serial.println("empty");
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        pir = Pin(27, Pin.IN)                         # HC-SR501 output: 3.3 V logic
        WARM_UP_MS = 30000                            # ignore the output while the sensor settles
        HOLD_MS = 60000                               # occupied until this long after the last movement
        started = last_motion = time.ticks_ms()
        occupied = False

        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, started) >= WARM_UP_MS and pir.value() == 1:
                last_motion = now
                if not occupied:
                    occupied = True
                    print("occupied")
            if occupied and time.ticks_diff(now, last_motion) >= HOLD_MS:
                occupied = False
                print("empty")
            time.sleep_ms(20)
      `,
      output: `
        occupied
        empty
      `,
      notes: ['The sensor\'s own hold time (a few seconds) only shapes its output; the 60 s here is the program\'s and survives any setting of the potentiometer.', 'To wake from deep sleep on movement instead, wire the PIR to an RTC-capable pin and enable that pin as the wake source ([[wake-up-sources]]).']
    },
    {
      title: 'Radar: moving and still targets from an LD2410',
      about: 'Finds each data frame on the radar\'s UART — it begins F4 F3 F2 F1 and ends F8 F7 F6 F5 — and prints the target state and the distances of the moving and the stationary target.',
      needs: 'An ESP32 DevKit and an LD2410 (or similar) radar module with 5 V supply and 3.3 V UART.',
      wiring: [['GPIO25', 'radar TX', 'our receive pin'], ['GPIO26', 'radar RX', 'our transmit pin'], ['5V (VIN)', 'radar VCC'], ['GND', 'radar GND']],
      blocks: `
        when started
          start serial at (115200) baud
          start UART (2) at (256000) baud on RX (25) TX (26)
        forever
          wait for a frame starting F4 F3 F2 F1 on UART (2)    // ends F8 F7 F6 F5 :: bus
          set [state v] to (byte 3 of the frame data)
          set [moving v] to (16-bit value of bytes 4 and 5 of the frame data)
          set [still v] to (16-bit value of bytes 7 and 8 of the frame data)
          print (join (state name of (state)) [ moving ] (moving) [ cm, still ] (still) [ cm])
        end
      `,
      cpp: String.raw`
        const uint8_t HEAD[4] = {0xF4, 0xF3, 0xF2, 0xF1};
        const char *STATES[] = {"nobody", "moving", "still", "moving and still"};

        // Finds one data frame: F4 F3 F2 F1, a 2-byte length, the data, F8 F7 F6 F5
        bool readFrame(uint8_t *data, int &len) {
          static int matched = 0;
          while (Serial2.available()) {
            uint8_t b = Serial2.read();
            matched = (b == HEAD[matched]) ? matched + 1 : (b == HEAD[0] ? 1 : 0);
            if (matched < 4) continue;
            matched = 0;
            uint8_t lenBytes[2], tail[4];
            if (Serial2.readBytes(lenBytes, 2) != 2) return false;
            len = lenBytes[0] | (lenBytes[1] << 8);
            if (len > 32 || Serial2.readBytes(data, len) != len) return false;
            Serial2.readBytes(tail, 4);
            return tail[0] == 0xF8 && tail[3] == 0xF5 && len >= 13 && data[0] == 0x02 && data[1] == 0xAA;
          }
          return false;
        }

        void setup() {
          Serial.begin(115200);
          Serial2.begin(256000, SERIAL_8N1, 25, 26);       // baud, config, RX pin, TX pin
        }

        void loop() {
          uint8_t d[32];
          int len;
          if (readFrame(d, len)) {
            int moving = d[3] | (d[4] << 8);                // distance of the moving target, cm
            int still = d[6] | (d[7] << 8);                 // distance of the stationary target, cm
            Serial.printf("%s  moving %d cm  still %d cm\n", STATES[d[2] & 3], moving, still);
          }
        }
      `,
      py: String.raw`
        from machine import UART
        import time

        radar = UART(2, baudrate=256000, rx=25, tx=26)     # radar TX -> GPIO25, radar RX -> GPIO26
        HEAD, TAIL = b"\xf4\xf3\xf2\xf1", b"\xf8\xf7\xf6\xf5"
        STATES = ("nobody", "moving", "still", "moving and still")
        buf = b""

        while True:
            buf += radar.read() or b""                      # whatever has arrived
            start = buf.find(HEAD)
            if start < 0:
                buf = buf[-3:]                              # keep a possible partial header
            elif len(buf) >= start + 6:
                n = buf[start + 4] | (buf[start + 5] << 8)  # length of the data part
                if n > 64:
                    buf = buf[start + 4:]                   # nonsense length: look for the next header
                elif len(buf) >= start + 6 + n + 4:         # the whole frame is here
                    data = buf[start + 6:start + 6 + n]
                    tail = buf[start + 6 + n:start + 10 + n]
                    buf = buf[start + 10 + n:]
                    if tail == TAIL and n >= 13 and data[0] == 0x02 and data[1] == 0xAA:
                        moving = data[3] | (data[4] << 8)   # distance of the moving target, cm
                        still = data[6] | (data[7] << 8)    # distance of the stationary target, cm
                        print("%s  moving %d cm  still %d cm" % (STATES[data[2] & 3], moving, still))
            time.sleep_ms(20)
      `,
      output: `
        moving and still  moving 140 cm  still 135 cm
        still  moving 0 cm  still 138 cm
        nobody  moving 0 cm  still 0 cm
      `,
      notes: ['This is the basic reporting frame of the LD2410 family; the module also has an engineering mode and a configuration protocol. Check the frame layout in your module\'s serial-protocol document.', 'Mount the radar facing the space, not the wall; metal behind or in front of it changes what it sees.']
    }
  ],
  quiz: [
    { q: 'A PIR light switches the room light off while a person sits reading. Why?', choices: ['The PIR is broken', 'A person sitting still produces no change in infrared across the lens zones', 'PIRs only work in the dark', 'The hold time is too long'], a: 1, why: 'A PIR responds to changes. Someone who stays still stops triggering it and the output falls after its hold time. Use a longer program timeout or a radar sensor.' },
    { q: 'You need a battery sensor that wakes an ESP32 on movement and lasts a year on a small cell. Which sensor?', choices: ['LD2410 radar', 'AM312 mini PIR', 'HC-SR04', 'A camera module'], a: 1, why: 'The AM312 draws a few microamps and has a plain digital output that can wake the chip from deep sleep. The radar draws about 80 mA.' },
    { q: 'An HC-SR501 module\'s output toggles wildly for the first 30–60 s after power-on. What should the program do?', choices: ['Restart the ESP32', 'Ignore the output until the warm-up is over', 'Raise the sensitivity', 'Switch to single-trigger mode'], a: 1, why: 'The element and its circuit need that time to settle; the output is meaningless meanwhile. The program above simply ignores the pin for the first 30 s.' },
    { q: 'A PIR mounted behind a window pane will see someone walking in the garden.', a: false, why: 'Ordinary glass blocks the far infrared that a PIR senses. It would see only through its own plastic lens, not through a window.' }
  ],
  applications: [
    'Corridor, stair and toilet lights that switch on for people and off a few minutes later.',
    'Burglar alarms and doorbell sensors, with the PIR on a sleeping ESP that wakes on movement.',
    'Room occupancy for heating, ventilation and desk booking, using radar to catch people at their desks.',
    'Fall and sleep monitoring with radar, which records no image.'
  ],
  sources: [
    'Hi-Link, *LD2410 serial communication protocol* and datasheet: frame layout, distance gates and the OUT pin.',
    'HC-SR501 PIR module datasheet: supply range, delay-time and block-time settings, repeatable and single-trigger modes.',
    'Espressif, *ESP-IDF Programming Guide*, sleep modes: GPIO wake-up from deep sleep (ext0 and ext1).'
  ],
  sim: 'sw-pir'
}
,

/* ================================================================ motion-sensors-imu */
{
  id: 'motion-sensors-imu',
  parent: 'sensing-the-world',
  title: 'Motion: accelerometers, gyroscopes, IMUs',
  level: 2,
  short: 'An accelerometer feels gravity and acceleration at once, a gyroscope feels rotation, and an IMU puts them together. Tilt is easy while the board stands still; everything else needs a filter, because accelerometers cannot tell gravity from movement and gyroscopes drift.',
  keywords: ['accelerometer', 'gyroscope', 'IMU', 'MPU6050', 'ADXL345', 'LSM6DS3', 'BNO055', 'ICM-20948', 'magnetometer', 'tilt', 'pitch', 'roll', 'yaw', 'gyro drift', 'complementary filter', 'sensor fusion', 'WHO_AM_I', 'g', 'MEMS'],
  prereq: ['choosing-a-sensor', 'i2c', 'registers-and-datasheets'],
  related: ['sensor-calibration', 'reading-sensors-reliably', 'balancing-robots', 'gesture-recognition', 'filtering-sensor-data', 'presence-and-motion-sensors', 'physics:acceleration'],
  body: `An **accelerometer** feels two things at once: gravity, which tells it which way is down, and acceleration, which tells it the board is being pushed. A **gyroscope** feels how fast the board turns. A **magnetometer** feels the Earth's magnetic field, which gives a compass heading. An **IMU** (inertial measurement unit) packs two or three of them into one chip: six axes for accelerometer plus gyroscope, nine with the magnetometer.

### What each one gives

- **Accelerometer, 3 axes:** acceleration in g (1 g = 9.81 m/s²). Lying still it reads exactly 1 g, pointing up, divided among the axes by the tilt, so the three numbers give **pitch and roll** (the simulation shows how). Moving, gravity and push add up, and the two cannot be separated.
- **Gyroscope, 3 axes:** rotation rate in °/s. Adding it up over time gives an angle, smooth and quick — but a tiny constant offset adds up too: 0.5 °/s of bias is 30° of error after a minute. That is **gyro drift**.
- **Magnetometer:** a heading, disturbed by steel, motors and magnets, and needing calibration.
- **Fusion:** the accelerometer is right on average and noisy; the gyro is smooth and drifts. A *complementary filter* trusts the gyro for the next instant and the accelerometer in the long run (formula below). Chips such as the BNO055 do the fusion inside and report angles directly.

### Parts and addresses

| Part | Axes | Address | Note |
|---|---|---|---|
| MPU6050 | accelerometer + gyro | 0x68 or 0x69 | common, cheap, often a clone |
| ICM-20948 | accelerometer, gyro, magnetometer | 0x68 or 0x69 | nine axes |
| LSM6DS3 | accelerometer + gyro | 0x6A | low power |
| ADXL345 | accelerometer, ±16 g | 0x53 | taps, free-fall detection |
| BNO055 | nine axes with fusion | 0x28 or 0x29 | angles straight from the chip |

The MPU6050 shares 0x68 with the DS3231 clock chip; its AD0 pin moves it to 0x69. Its WHO_AM_I register (0x75) reads 0x68: a different value betrays a different chip. A fresh MPU6050 starts asleep: write 0 to register 0x6B to wake it. Range settings trade span for sensitivity: at ±2 g it gives 16 384 counts per g, at ±250 °/s 131 counts per °/s.

### Traps

- **Shaking spoils tilt.** While the board accelerates the tilt from the accelerometer is wrong.
- **Axes differ.** Their directions and signs vary between chips and boards: tip the board and look.
- **Calibrate the gyro at rest.** Average a few hundred readings while the board is still and subtract them ([[sensor-calibration]]).
- **Vibration** from motors enters the readings; mount rigidly and low-pass filter.

> [!key] Lying still, an accelerometer gives tilt; moving, it cannot separate gravity from motion. A gyroscope gives smooth rotation that drifts. Combine them with a complementary filter, calibrate the gyro's offset at rest, and read the identity register to be sure of the chip.`,
  ideas: [
    'An accelerometer measures gravity plus acceleration, so at rest it gives pitch and roll but not yaw.',
    'A gyroscope gives rotation rate; integrating it gives an angle that drifts because a small offset adds up.',
    'A complementary filter trusts the gyroscope for fast changes and the accelerometer for the long-term angle.',
    'Axes, signs, addresses and the chip itself differ between boards: check WHO_AM_I and tip the board.'
  ],
  pitfalls: [
    'The accelerometer gives the angle even while the board is moving — Movement adds to gravity and corrupts the tilt; only at rest or at constant speed does it read gravity alone.',
    'Integrating the gyroscope gives a reliable angle — Its offset grows into drift of tens of degrees within a minute unless it is calibrated and corrected by the accelerometer.',
    'An accelerometer can find which way the board faces (yaw) — Turning about the vertical axis leaves gravity unchanged; yaw needs a gyroscope or a magnetometer.'
  ],
  terms: [
    { term: 'Accelerometer', also: ['MEMS accelerometer', 'g-sensor'], def: 'A sensor that measures acceleration along three axes, including the constant 1 g of gravity. At rest it reveals tilt; in motion it reveals force.' },
    { term: 'Gyroscope', also: ['gyro', 'rate gyro'], def: 'A sensor that measures rotation rate around each axis in degrees per second. Integrating its output gives an angle.' },
    { term: 'IMU', also: ['inertial measurement unit', '6-axis', '9-axis'], def: 'A chip combining accelerometer and gyroscope (six axes), often with a magnetometer (nine axes), to track orientation and movement.' },
    { term: 'Gyro drift', also: ['bias', 'zero-rate offset'], def: 'The slow growth of angle error when a gyroscope\'s small constant offset is integrated over time. It is removed by measuring the offset at rest and by fusing with the accelerometer.' },
    { term: 'Complementary filter', also: ['sensor fusion'], def: 'A simple fusion: at each step take most of the angle from the gyroscope-updated estimate and a little from the accelerometer, so that drift is corrected without accelerometer noise.' }
  ],
  choose: {
    good: ['MPU6050 or ICM-20948: cheap, well-supported six- or nine-axis motion on I2C', 'ADXL345 or LIS3DH: tilt, taps and free fall at low power', 'BNO055: orientation angles with no filter code of your own', 'LSM6DS3 or similar: battery devices that wake on motion'],
    avoid: ['Deriving yaw from an accelerometer', 'Integrating a gyroscope without correction for more than seconds', 'A magnetometer beside motors or steel without calibration', 'Trusting the label: some "MPU6050" boards hold a different chip'],
    check: ['WHO_AM_I against the datasheet', 'The range setting against the motion you expect', 'The I2C address against the DS3231 or other 0x68 parts', 'Which way the axes point on your board']
  },
  formulas: [
    {
      name: 'Complementary filter step',
      expr: 'theta = alpha*(theta0 + omega*dt) + (1 - alpha)*thetaAcc',
      tex: '\\theta = \\alpha\\,(\\theta_0 + \\omega\\,\\Delta t) + (1 - \\alpha)\\,\\theta_{\\mathrm{acc}}',
      vars: {
        theta: { name: 'new angle estimate', q: 'angle', unit: '°', signed: true, tex: '\\theta' },
        alpha: { name: 'trust in the gyroscope (0.9–0.99)', q: 'ratio', unit: '', value: 0.98, min: 0, max: 1, tex: '\\alpha' },
        theta0: { name: 'previous angle estimate', q: 'angle', unit: '°', signed: true, value: 10, tex: '\\theta_0' },
        omega: { name: 'gyroscope rate', q: 'angvel', unit: '°/s', signed: true, value: 30, tex: '\\omega' },
        dt: { name: 'time since the last step', q: 'time', unit: 'ms', value: 10, tex: '\\Delta t' },
        thetaAcc: { name: 'angle from the accelerometer', q: 'angle', unit: '°', signed: true, value: 12, tex: '\\theta_{\\mathrm{acc}}' }
      },
      solveFor: 'theta',
      note: 'The gyroscope term is smooth but drifts; the accelerometer term is noisy but anchored to gravity. With α = 0.98 and 100 steps a second the accelerometer takes over in about half a second.',
      stories: { theta: 'The filter\'s last angle was {theta0}, the gyroscope reads {omega} for {dt}, and the accelerometer says {thetaAcc}. With α = {alpha}, what is the new angle?' }
    }
  ],
  examples: [
    {
      title: 'Which way is the board tilted?',
      q: 'A board lies still. Its accelerometer reads ax = 0.50 g, ay = 0, az = 0.866 g. What are pitch and roll, and what is the length of the vector?',
      steps: [{ text: 'For a board at rest the three numbers are the components of gravity, so their length should be 1 g:', tex: '\\sqrt{0.50^2 + 0 + 0.866^2} = 1.00\\,\\mathrm{g}' }, { text: 'Pitch and roll follow from the components:', tex: '\\mathrm{pitch} = \\mathrm{atan2}\\!\\left(-a_x,\\sqrt{a_y^2 + a_z^2}\\right) = -30^\\circ,\\qquad \\mathrm{roll} = \\mathrm{atan2}(a_y, a_z) = 0^\\circ' }, 'A length well away from 1 g would show that the board is also being accelerated, and the angles could not be trusted.'],
      a: 'Pitch −30°, roll 0°. The vector has length 1 g, so the board really is at rest. (The sign of pitch depends on how the chip\'s axes are defined.)'
    }
  ],
  code: [
    {
      title: 'Tilt from an MPU6050',
      about: 'Wakes the chip, checks its identity, then reads 14 bytes every 200 ms — accelerometer, temperature and gyroscope — and prints pitch and roll from gravity, the rotation rate about Z and the chip temperature.',
      needs: 'An ESP32 DevKit and an MPU6050 breakout (GY-521 or similar), address 0x68.',
      wiring: [['GPIO21', 'MPU6050 SDA'], ['GPIO22', 'MPU6050 SCL'], ['3V3', 'MPU6050 VCC'], ['GND', 'MPU6050 GND and AD0', 'AD0 low: address 0x68']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22)
          I2C write (0x00) to address (0x68) register (0x6B)    // wake the chip: it starts asleep
          print (join [WHO_AM_I = 0x] (hex (I2C read (1) bytes from address (0x68) register (0x75))))

        every (0.2) seconds
          set [raw v] to (I2C read (14) bytes from address (0x68) register (0x3B))
          set [ax v] to ((signed 16-bit value of bytes 1 and 2 of (raw)) / (16384))
          set [ay v] to ((signed 16-bit value of bytes 3 and 4 of (raw)) / (16384))
          set [az v] to ((signed 16-bit value of bytes 5 and 6 of (raw)) / (16384))
          set [pitch v] to (degrees of (atan2 of ((0) - (ax)) and (square root of (((ay) * (ay)) + ((az) * (az))))))
          set [roll v] to (degrees of (atan2 of (ay) and (az)))
          print (join [pitch ] (round (pitch)) [  roll ] (round (roll)))
      `,
      cpp: String.raw`
        #include <Wire.h>

        const uint8_t MPU = 0x68;                    // 0x69 when AD0 is high

        void writeReg(uint8_t reg, uint8_t val) {
          Wire.beginTransmission(MPU);
          Wire.write(reg);
          Wire.write(val);
          Wire.endTransmission();
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(21, 22, 400000);
          writeReg(0x6B, 0x00);                      // wake the chip: it starts asleep
          Wire.beginTransmission(MPU);
          Wire.write(0x75);                          // WHO_AM_I
          Wire.endTransmission(false);
          Wire.requestFrom(MPU, (size_t)1);
          Serial.printf("WHO_AM_I = 0x%02X (0x68 for an MPU6050)\n", Wire.read());
        }

        void loop() {
          Wire.beginTransmission(MPU);
          Wire.write(0x3B);                          // first of 14 bytes: accel X Y Z, temperature, gyro X Y Z
          Wire.endTransmission(false);
          if (Wire.requestFrom(MPU, (size_t)14) != 14) {
            Serial.println("MPU6050 not answering");
            delay(500);
            return;
          }
          int16_t v[7];
          for (int i = 0; i < 7; i++) {
            uint8_t hi = Wire.read();
            uint8_t lo = Wire.read();
            v[i] = (int16_t)((hi << 8) | lo);
          }
          float ax = v[0] / 16384.0, ay = v[1] / 16384.0, az = v[2] / 16384.0;   // g at the ±2 g range
          float pitch = atan2(-ax, sqrt(ay * ay + az * az)) * 180.0 / PI;
          float roll = atan2(ay, az) * 180.0 / PI;
          Serial.printf("pitch %.1f  roll %.1f  gyro Z %.1f deg/s  chip %.1f C\n", pitch, roll, v[6] / 131.0, v[3] / 340.0 + 36.53);
          delay(200);
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import struct, math, time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
        MPU = 0x68                                   # 0x69 when AD0 is high

        i2c.writeto_mem(MPU, 0x6B, b"\x00")          # wake the chip: it starts asleep
        print("WHO_AM_I = 0x%02X (0x68 for an MPU6050)" % i2c.readfrom_mem(MPU, 0x75, 1)[0])

        while True:
            try:
                raw = i2c.readfrom_mem(MPU, 0x3B, 14)        # accel X Y Z, temperature, gyro X Y Z
                ax, ay, az, temp, gx, gy, gz = struct.unpack(">7h", raw)   # seven signed 16-bit numbers
                ax, ay, az = ax / 16384, ay / 16384, az / 16384            # g at the ±2 g range
                pitch = math.degrees(math.atan2(-ax, math.sqrt(ay * ay + az * az)))
                roll = math.degrees(math.atan2(ay, az))
                print("pitch %.1f  roll %.1f  gyro Z %.1f deg/s  chip %.1f C" % (pitch, roll, gz / 131, temp / 340 + 36.53))
            except OSError:
                print("MPU6050 not answering")
            time.sleep_ms(200)
      `,
      output: `
        WHO_AM_I = 0x68 (0x68 for an MPU6050)
        pitch -0.4  roll 1.2  gyro Z -0.3 deg/s  chip 29.8 C
        pitch -0.5  roll 1.1  gyro Z -0.4 deg/s  chip 29.8 C
      `,
      notes: ['The gyro Z value at rest is the chip\'s offset: the number to subtract in a calibration ([[sensor-calibration]]).', 'Other WHO_AM_I values mean another chip on the board: 0x70 is an MPU6500 and 0x71 an MPU9250. Many registers are the same, but check the datasheet of the chip you hold.', 'For faster motion use the chip\'s FIFO and interrupt pin instead of polling.']
    }
  ],
  quiz: [
    { q: 'A board lies flat and still. The accelerometer reads (0, 0, 1 g). The board is then turned 90° about the vertical axis. What does the accelerometer read afterwards?', choices: ['(1 g, 0, 0)', '(0, 0, 1 g): the same, so yaw cannot be seen', '(0, 1 g, 0)', 'Zero on all axes'], a: 1, why: 'Turning about the vertical axis does not change the direction of gravity relative to the board. Yaw needs a gyroscope or a magnetometer.' },
    { q: 'A gyroscope has an uncorrected offset of 0.5 °/s. After 2 minutes of integration, how far off is its angle?', choices: ['0.5°', '10°', '60°', '600°'], a: 2, why: 'The error is offset × time = 0.5 °/s × 120 s = 60°. This is why gyro angles need offset calibration and fusion with the accelerometer.' },
    { q: 'An MPU6050 and a DS3231 clock chip sit on one I2C bus and neither is found reliably. What is the cause, and the fix?', choices: ['Pull-ups too weak: use 1 kΩ', 'Both answer at 0x68: tie the MPU6050\'s AD0 pin high to move it to 0x69', 'The clock stops the bus', 'The ESP32 allows only one I2C device'], a: 1, why: 'Two devices at one address collide. The AD0 pin of the MPU6050 selects 0x68 or 0x69.' },
    { q: 'A robot\'s tilt, computed from the accelerometer alone, is steady while the robot stands still and jumps around while it drives and brakes.', a: true, why: 'Driving and braking add acceleration to gravity, so the measured vector no longer points straight down. This is what the gyroscope part of the filter bridges.' }
  ],
  applications: [
    'Self-balancing robots and drones, which fuse gyro and accelerometer at hundreds of readings a second.',
    'Step counters, tap and shake detection, and "pick up to wake" in wearables.',
    'Vibration monitoring of motors, pumps and fans from the pattern of acceleration.',
    'Gesture and activity recognition with a small neural network ([[gesture-recognition]]).'
  ],
  sources: [
    'InvenSense (TDK), *MPU-6000 and MPU-6050 product specification and register map*: sensitivity, the registers 0x3B–0x48, 0x6B and 0x75.',
    'Analog Devices, *ADXL345 datasheet*: ranges, tap and free-fall detection.',
    'Bosch Sensortec, *BNO055 datasheet*: on-chip sensor fusion and the orientation outputs.'
  ],
  sim: 'sw-imu-tilt'
},

/* ================================================================ air-quality-sensors */
{
  id: 'air-quality-sensors',
  parent: 'sensing-the-world',
  title: 'Air quality: CO₂, VOC, particles',
  level: 2,
  short: 'Carbon dioxide, volatile organic compounds and dust are three different measurements. A true CO₂ sensor such as the SCD4x measures the gas; "equivalent CO₂" chips only guess from other gases. Hobby gas sensors are not safety devices.',
  keywords: ['air quality', 'CO2', 'carbon dioxide', 'ppm', 'NDIR', 'photoacoustic', 'SCD40', 'SCD41', 'SCD30', 'MH-Z19', 'eCO2', 'SGP30', 'SGP40', 'CCS811', 'ENS160', 'BME680', 'VOC', 'VOC index', 'PMS5003', 'PM2.5', 'particulate', 'MQ-135', 'burn-in'],
  prereq: ['choosing-a-sensor', 'humidity-and-pressure-sensors', 'uart'],
  related: ['sensor-calibration', 'reading-sensors-reliably', 'project-weather-station', 'esphome', 'registers-and-datasheets'],
  body: `"Air quality" is three measurements pretending to be one: how much **carbon dioxide** (a stand-in for stale air), how much **volatile organic compounds** (fumes, cooking, cleaning products) and how much **dust**. Each has its own sensors, and only some of them measure what their label says.

### CO₂: true and estimated

| Part | Address or bus | Measures | Trust |
|---|---|---|---|
| SCD40 / SCD41 | I2C 0x62 | the CO₂ gas, photoacoustically, plus T and RH | ±(50 ppm + 5 %) for the SCD40 |
| SCD30, MH-Z19 | I2C 0x61, UART | the CO₂ gas, by infrared absorption (NDIR) | good, larger and slower |
| SGP30, CCS811, ENS160 | I2C 0x58, 0x5A, … | *equivalent* CO₂, guessed from other gases | a hint, not CO₂ |

Outdoors the air holds a little over 420 ppm of CO₂. Indoors, people raise it: about 1000 ppm is a common limit for "fresh enough", and above 2000 ppm rooms feel stuffy. An *eCO₂* chip assumes people are the only source of the gases it senses; a spilled bottle of alcohol, a cooking smell or a cleaning spray then reads as "high CO₂". The SCD4x measures the gas, answers once every 5 s in its periodic mode, and draws about 15–20 mA. Its automatic self-calibration assumes that it meets fresh air now and then (roughly weekly): in a room that is never aired it drifts low.

### VOC and other gases

The SGP40 (0x59) gives a raw signal that Sensirion's algorithm turns into a **VOC index** from 1 to 500, where 100 is the typical level of the past day: relative, not ppm. The BME680 and BME688 add a heated gas-resistance element to a BME280. **MQ-series** sensors are heated metal-oxide beads on an analogue pin: they need a day or two of **burn-in**, draw about 150 mA for the heater, respond to many gases at once and need calibration for anything quantitative.

> [!warn] Never rely on a hobby sensor for gas, smoke or carbon-monoxide safety. MQ-type and other cheap sensors drift, cross-react and fail without warning. Use alarms marked to the relevant standard (EN 14604 for smoke, EN 50291 for carbon monoxide in Europe) and let the ESP32 only *add* a notification.

### Particles

The PMS5003 and its relatives draw air past a laser and count scattered flashes; the part turns counts into PM1.0, PM2.5 and PM10 in µg/m³ and sends them every second over a 9600-baud UART. It runs from 5 V with 3.3 V signals, draws about 100 mA with its fan, and has a sleep pin to rest the fan and laser between readings. Cheap dust sensors follow trends well and absolute values poorly; above about 80 % humidity droplets inflate the reading.

### Placement

Give the sensor moving air but not your breath, a stove or a window draught; compensate CO₂ for altitude or pressure when the library offers it; and allow the warm-up each part asks for.

> [!key] Measure CO₂ with a CO₂ sensor (SCD4x), treat eCO₂ and VOC figures as hints, and use a particle sensor for dust. Hobby gas sensors are for curiosity, never for safety.`,
  ideas: [
    'CO₂, VOCs and dust are different measurements with different sensors.',
    'An SCD4x measures real CO₂; eCO₂ chips estimate it from other gases and are fooled by fumes.',
    'VOC sensors report a relative index, not a concentration; MQ sensors need burn-in and calibration.',
    'Never use a hobby gas sensor as a safety device for gas, smoke or carbon monoxide.'
  ],
  pitfalls: [
    'eCO₂ from an SGP30 or CCS811 is carbon dioxide — It is an estimate computed from hydrogen and VOC readings; a cleaning spray or a cooking smell raises it with no change in CO₂.',
    'An MQ gas sensor can guard a gas stove — It cannot: it drifts, reacts to many gases and gives no guarantee. Use a certified alarm.',
    'A CO₂ sensor needs no care once installed — Its automatic calibration assumes occasional fresh air; in a sealed room it drifts, and pressure and altitude shift the reading.'
  ],
  terms: [
    { term: 'NDIR', also: ['non-dispersive infrared', 'photoacoustic CO₂ sensor'], def: 'A way to measure CO₂ by how strongly the gas absorbs infrared light of one wavelength. The SCD4x uses a photoacoustic variant of the same principle.' },
    { term: 'eCO₂', also: ['equivalent CO₂', 'estimated CO₂'], def: 'A CO₂ figure computed from the VOC or hydrogen a chip senses, assuming people are the source. It is a hint about ventilation, not a measurement of the gas.' },
    { term: 'VOC index', also: ['volatile organic compounds', 'TVOC'], def: 'A number from 1 to 500 (Sensirion) for the level of volatile organic gases relative to the recent past, where 100 is typical. It is not a concentration.' },
    { term: 'PM2.5', also: ['particulate matter', 'PM10', 'µg/m³'], def: 'The mass of airborne particles smaller than 2.5 µm per cubic metre of air, in µg/m³. Laser sensors estimate it by counting scattered light.' },
    { term: 'Burn-in', also: ['preheating', 'conditioning'], def: 'The hours of continuous heating a metal-oxide gas sensor needs when new, before its readings become steady enough to calibrate.' }
  ],
  choose: {
    good: ['SCD40 / SCD41: real CO₂, temperature and humidity for rooms and offices', 'SGP40 or BME680: a relative VOC trend, for "air got worse"', 'PMS5003 or SPS30: dust and smoke levels, outdoors and indoors', 'MH-Z19: a cheaper NDIR CO₂ sensor on a UART'],
    avoid: ['eCO₂ chips for ventilation control where numbers matter', 'MQ sensors as safety devices of any kind', 'A particle sensor in fog or condensing air', 'An SCD4x in a room that is never aired, without a manual calibration'],
    check: ['That the figure is measured CO₂ in ppm, not an estimate', 'The warm-up, burn-in and measurement interval of the part', 'The supply: 5 V and about 100 mA for a particle sensor', 'Altitude or pressure compensation for CO₂']
  },
  code: [
    {
      title: 'CO₂, temperature and humidity from an SCD4x',
      about: 'Starts the SCD4x\'s periodic measurement (one reading every 5 s), asks whether a reading is ready, then reads nine bytes — three words, each followed by its CRC — and prints them. No library is needed.',
      needs: 'An ESP32 DevKit and an SCD40 or SCD41 breakout (address 0x62).',
      wiring: [['GPIO21', 'SCD4x SDA'], ['GPIO22', 'SCD4x SCL'], ['3V3', 'SCD4x VCC'], ['GND', 'SCD4x GND']],
      blocks: `
        when started
          start serial at (115200) baud
          start I2C on SDA (21) SCL (22)
          I2C write (0x3F86) to address (0x62)       // stop any earlier measurement
          wait (0.5) seconds
          I2C write (0x21B1) to address (0x62)       // start periodic measurement: a reading every 5 s
        every (1) seconds
          I2C write (0xE4B8) to address (0x62)       // is a reading ready?
          set [status v] to (16-bit value of (I2C read (3) bytes from address (0x62)))
          if <((status) AND (0x07FF)) > (0)> then
            I2C write (0xEC05) to address (0x62)     // read the measurement
            set [m v] to (I2C read (9) bytes from address (0x62))    // three words, each with a CRC
            print (join [CO2 ] (word 1 of (m)) [ ppm  ] (-45 + 175 * (word 2 of (m)) / 65535) [ C  ] (100 * (word 3 of (m)) / 65535) [ %RH])
          end
      `,
      cpp: String.raw`
        #include <Wire.h>

        const uint8_t SCD4X = 0x62;

        uint8_t crc8(const uint8_t *d) {             // Sensirion CRC of two bytes: polynomial 0x31, start 0xFF
          uint8_t crc = 0xFF;
          for (int i = 0; i < 2; i++) {
            crc ^= d[i];
            for (int b = 0; b < 8; b++) crc = (crc & 0x80) ? (crc << 1) ^ 0x31 : crc << 1;
          }
          return crc;
        }

        void command(uint16_t cmd) {
          Wire.beginTransmission(SCD4X);
          Wire.write((uint8_t)(cmd >> 8));
          Wire.write((uint8_t)(cmd & 0xFF));
          Wire.endTransmission();
        }

        bool readWords(uint16_t cmd, int words, uint16_t *out) {    // each word comes with its CRC
          command(cmd);
          delay(1);
          if (Wire.requestFrom(SCD4X, (size_t)(words * 3)) != words * 3) return false;
          for (int i = 0; i < words; i++) {
            uint8_t d[3];
            for (int k = 0; k < 3; k++) d[k] = Wire.read();
            if (crc8(d) != d[2]) return false;
            out[i] = (d[0] << 8) | d[1];
          }
          return true;
        }

        void setup() {
          Serial.begin(115200);
          Wire.begin(21, 22);
          command(0x3F86);                           // stop any earlier measurement
          delay(500);
          command(0x21B1);                           // start periodic measurement: a reading every 5 s
        }

        void loop() {
          uint16_t status, m[3];
          if (readWords(0xE4B8, 1, &status) && (status & 0x07FF) && readWords(0xEC05, 3, m))
            Serial.printf("CO2 %u ppm  %.1f C  %.0f %%RH\n", m[0], -45 + 175.0 * m[1] / 65535, 100.0 * m[2] / 65535);
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import I2C, Pin
        import time

        i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=100000)
        SCD4X = 0x62

        def crc8(data):                              # Sensirion CRC of two bytes: polynomial 0x31, start 0xFF
            crc = 0xFF
            for byte in data:
                crc ^= byte
                for _ in range(8):
                    crc = ((crc << 1) ^ 0x31) & 0xFF if crc & 0x80 else (crc << 1) & 0xFF
            return crc

        def read_words(cmd, words):                  # each word comes with its CRC
            i2c.writeto(SCD4X, cmd.to_bytes(2, "big"))
            time.sleep_ms(1)
            d = i2c.readfrom(SCD4X, words * 3)
            out = []
            for i in range(words):
                chunk = d[i * 3:i * 3 + 3]
                if crc8(chunk[:2]) != chunk[2]:
                    raise ValueError("CRC mismatch")
                out.append((chunk[0] << 8) | chunk[1])
            return out

        i2c.writeto(SCD4X, b"\x3f\x86")              # stop any earlier measurement
        time.sleep_ms(500)
        i2c.writeto(SCD4X, b"\x21\xb1")              # start periodic measurement: a reading every 5 s

        while True:
            try:
                if read_words(0xE4B8, 1)[0] & 0x07FF:                # a reading is ready
                    co2, t, rh = read_words(0xEC05, 3)
                    print("CO2 %d ppm  %.1f C  %.0f %%RH" % (co2, -45 + 175 * t / 65535, 100 * rh / 65535))
            except (OSError, ValueError):
                print("SCD4x read failed")
            time.sleep(1)
      `,
      output: `
        CO2 612 ppm  22.4 C  48 %RH
        CO2 618 ppm  22.4 C  48 %RH
      `,
      notes: ['The first reading appears about 5 s after the start; the program prints nothing until a reading is ready.', 'The SCD4x\'s temperature reads a little high from its own heat: do not use it as the room thermometer.', 'Sensirion\'s libraries add altitude, pressure and calibration commands; the register-level commands above are the same ones they send.']
    }
  ],
  quiz: [
    { q: 'An SGP30 shows 2000 ppm eCO₂ right after a bottle of hand sanitiser was used in the room. What explains it?', choices: ['The room really has 2000 ppm of CO₂', 'The chip senses alcohol vapour and computes an "equivalent" CO₂ from it', 'The chip is faulty', 'The sensor needs a pull-up'], a: 1, why: 'eCO₂ is derived from other gases, assuming people are the source. Alcohol is a VOC, so the estimate shoots up while CO₂ is unchanged.' },
    { q: 'An SCD40 in a sealed storage room that is never aired reads 380 ppm after some months, though the room is stale. Why?', choices: ['The gas has gone', 'Its automatic self-calibration assumed the lowest values were fresh air (about 400 ppm) and drifted low', 'The CRC is wrong', 'The humidity is too high'], a: 1, why: 'The automatic calibration needs occasional fresh air. Without it the sensor adjusts itself to the wrong baseline; calibrate manually or air the room.' },
    { q: 'An ESP32 project with an MQ-2 sensor will be the only gas alarm in a kitchen.', a: false, why: 'MQ-type sensors drift, react to many gases and fail silently; they are not certified safety devices. Use a certified alarm and let the ESP32 only add notifications.' },
    { q: 'A PMS5003 reports high PM2.5 on a foggy morning although the air looks clean. What is the likely reason?', choices: ['Fog is full of pollution', 'At high humidity water droplets scatter the laser like particles and inflate the reading', 'The fan is slow', 'The UART is at the wrong baud rate'], a: 1, why: 'Optical particle sensors cannot tell water droplets from dust. Above about 80 % humidity the readings are biased high.' }
  ],
  applications: [
    'Classroom and office CO₂ monitors that show a traffic light and prompt ventilation.',
    'Ventilation control: a fan or window actuator driven by CO₂ with hysteresis.',
    'Smoke and wildfire dust monitoring with PM2.5 sensors uploading to community maps.',
    'Indoor environment loggers combining CO₂, VOC index, humidity and temperature.'
  ],
  sources: [
    'Sensirion, *SCD4x datasheet*: the I2C commands (0x21B1, 0xE4B8, 0xEC05, 0x3F86), CRC, accuracy and automatic self-calibration.',
    'Sensirion, *SGP40 datasheet* and VOC index algorithm description.',
    'Plantower, *PMS5003 data manual*: the serial frame and the sleep control.'
  ]
}
,

/* ================================================================ soil-and-water-sensors */
{
  id: 'soil-and-water-sensors',
  parent: 'sensing-the-world',
  title: 'Soil, water level and flow',
  level: 1,
  short: 'How wet is the soil, how full is the tank, how much water has passed? Capacitive probes outlast resistive ones, a pressure transducer or float gives the level, and a turbine meter counts pulses. All of them live in wet places, so survival comes before accuracy.',
  keywords: ['soil moisture', 'capacitive soil probe', 'resistive probe', 'corrosion', 'water level', 'float switch', 'pressure transducer', 'hydrostatic', 'flow meter', 'YF-S201', 'turbine', 'pulses per litre', 'K-factor', 'leak sensor', 'TDS', 'pH', 'irrigation', 'tank'],
  prereq: ['choosing-a-sensor', 'the-esp-adc', 'interrupts'],
  related: ['distance-sensors', 'pulse-counting', 'sensor-calibration', 'switching-dc-loads', 'four-to-twenty-milliamp', 'project-plant-watering', 'physics:hydrostatic-pressure'],
  body: `Gardens, tanks and pipes need three kinds of sensing: how wet the soil is, how full a tank is, and how much water has flowed. All sit in wet, corroding places, so the first question is always how long the sensor will last.

### Soil moisture

- **Resistive probes** are two bare prongs: the wetter the soil, the lower the resistance. A DC current corrodes them within weeks; if you use one, power it from a GPIO only for the few milliseconds of a reading.
- **Capacitive probes** use the probe board as a capacitor, whose value changes with moisture; a small oscillator on the board turns it into an analogue voltage. No metal touches the soil, so they last for years. The output usually *falls* as the soil gets wetter, and its two end values differ from module to module: measure the reading in dry air and in a glass of water, then map between them ([[sensor-calibration]]). Seal the exposed edge of the board and the electronics above the mark, or water creeps up and kills it.
- A capacitive probe gives a **relative index**, not a true percentage of water: soils, air gaps and salinity all shift it. For a plant, "above 40 %" learned from your own pot beats any published figure.
- Soil *temperature* is a stainless DS18B20 probe ([[temperature-sensors]]).

### Water level

- **Float switch:** a magnet and a reed switch in a float; one wire pair, robust, one level each.
- **Ultrasonic from above** ([[distance-sensors]]): no contact, but condensation, foam and narrow tanks that echo the walls spoil it.
- **Pressure transducer at the bottom:** water pressure is $p = \\rho g h$, about 9.8 kPa per metre of height. A submersible sensor with an analogue or 4–20 mA output ([[four-to-twenty-milliamp]]) gives the level whatever the surface does, and the formula below turns pressure into height.
- **Conductive probes** only say whether water touches a point; drive them with alternating polarity or short pulses so that electrolysis does not eat them.

### Flow

A turbine flow meter such as the YF-S201 (1–30 L/min, 5 V supply) spins a rotor past a Hall sensor: one pulse per revolution, about 7.5 Hz for each litre per minute, roughly 450 pulses per litre. Count the pulses with an interrupt or the pulse counter ([[pulse-counting]]) and divide by the *pulses per litre* (the **K-factor**). Every meter differs, so run a known volume through yours and calibrate. Air bubbles, grit and flows below the minimum make it read low; the arrow on the body gives the direction.

> [!warn] Water and mains do not mix. Keep every probe, valve and the ESP itself at low voltage, and put mains pumps or valves behind proper isolation and an enclosure ([[switching-mains-safely]]).

> [!key] Capacitive probes beat resistive ones for lasting; calibrate them dry and wet. Use pressure or a float for tank level, and count a turbine's pulses for flow — and calibrate that with a measured volume.`,
  ideas: [
    'Resistive soil probes corrode within weeks on DC; capacitive probes have no exposed metal and last for years.',
    'A capacitive probe gives a relative index that must be calibrated dry and wet.',
    'Water pressure is ρgh: about 9.8 kPa per metre, so a pressure transducer measures level.',
    'A turbine flow meter gives pulses; divide by pulses per litre, after calibrating with a known volume.'
  ],
  pitfalls: [
    'The soil probe reads moisture in percent — It gives a voltage that depends on the module, soil and air gaps; the percentage exists only after your own dry-and-wet calibration.',
    'A resistive probe is fine if it is cheap — Powered continuously it electrolyses and corrodes in weeks, and the readings drift all the while.',
    'The datasheet K-factor is exact — It varies with each meter, the flow rate and the plumbing: catch a known volume and measure your own.'
  ],
  terms: [
    { term: 'Capacitive soil probe', also: ['capacitive moisture sensor'], def: 'A soil-moisture sensor whose electrodes sit under a coating on a circuit board. Soil water changes their capacitance, which an on-board circuit turns into a voltage; no bare metal touches the soil.' },
    { term: 'Hydrostatic pressure', also: ['water-column pressure'], def: 'The pressure of a column of liquid at depth h: ρ g h, about 9.8 kPa per metre of fresh water. A pressure sensor at the bottom of a tank therefore measures its level.' },
    { term: 'K-factor', also: ['pulses per litre', 'calibration factor'], def: 'The number of pulses a flow meter gives for each litre that passes, found by calibration. Volume equals pulses divided by the K-factor.' },
    { term: 'Electrolysis', also: ['electrode corrosion', 'polarisation'], def: 'The chemical attack on metal electrodes by a direct current flowing through water or damp soil. Alternating or briefly pulsed drive avoids it.' },
    { term: 'Float switch', also: ['level switch', 'reed float'], def: 'A float carrying a magnet that closes a reed switch at a fixed level: a robust one-bit level sensor.' }
  ],
  choose: {
    good: ['Capacitive soil probe, sealed and calibrated: houseplants and gardens', 'Float switch: pump-on and overflow-off, with no software to fail', 'Submersible pressure transducer: the level of a deep tank to the centimetre', 'YF-S201 turbine meter: litres counted in garden or workshop lines'],
    avoid: ['A resistive soil probe powered all the time', 'Ultrasonic level sensing in foamy or narrow tanks', 'Mains voltage anywhere near the water', 'Trusting a flow meter\'s K-factor without calibration'],
    check: ['Which end of the capacitive probe is dry and which is wet, in raw counts', 'That the probe\'s electronics stay above the soil line', 'A gauge (vented) or absolute pressure sensor, as the tank needs', 'The minimum flow at which the meter still turns']
  },
  formulas: [
    {
      name: 'Pressure of a water column',
      expr: 'p = rho*g*h',
      tex: 'p = \\rho\\,g\\,h',
      vars: {
        p: { name: 'pressure at the sensor (above the surface pressure)', q: 'pressure', unit: 'kPa', tex: 'p' },
        rho: { const: 'rhoW', tex: '\\rho' },
        g: { const: 'g', tex: 'g' },
        h: { name: 'depth of water above the sensor', q: 'length', unit: 'm', value: 1.5, tex: 'h' }
      },
      solveFor: 'p',
      note: 'For a submersible gauge sensor vented to the air. Seawater is about 3 % denser; a warm liquid is a little lighter.',
      stories: { p: 'A pressure sensor lies at the bottom of a tank holding {h} of water. What gauge pressure does it see?', h: 'A level sensor on the tank floor reads {p}. How deep is the water?' }
    }
  ],
  examples: [
    {
      title: 'How full is the tank?',
      q: 'A submersible gauge sensor at the bottom of a rainwater tank reads 14.7 kPa. The tank is 2.0 m tall. How full is it?',
      steps: [{ text: 'Solve $p = \\rho g h$ for the height:', tex: 'h = \\frac{p}{\\rho g} = \\frac{14\\,700\\ \\mathrm{Pa}}{1000\\ \\mathrm{kg/m^3}\\times 9.81\\ \\mathrm{m/s^2}} = 1.50\\ \\mathrm{m}' }, 'The tank is 2.0 m tall, so it is $1.50 / 2.0 = 75\\ \\%$ full.'],
      a: 'The water is 1.50 m deep: the tank is 75 % full.'
    }
  ],
  code: [
    {
      title: 'Soil moisture in percent, calibrated dry and wet',
      about: 'Averages 16 readings of a capacitive probe and maps them between two numbers you measured yourself: the raw reading in dry air (0 %) and in a glass of water (100 %).',
      needs: 'An ESP32 DevKit and a capacitive soil moisture probe (analogue output).',
      wiring: [['GPIO34', 'probe AOUT', 'ADC1 channel: usable with Wi-Fi on'], ['3V3', 'probe VCC'], ['GND', 'probe GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set [dry v] to (2900)       // the raw reading in dry air: measure yours
          set [wet v] to (1300)       // the raw reading in a glass of water: measure yours
        forever
          set [raw v] to (average of (16) readings of (analog read pin (34)))
          set [pct v] to (map (raw) from (dry) (wet) to (0) (100))
          if <(pct) < (0)> then
            set [pct v] to (0)
          else if <(pct) > (100)> then
            set [pct v] to (100)
          end
          print (join [raw ] (raw) [  moisture ] (round (pct)) [ %])
          wait (1) seconds
        end
      `,
      cpp: String.raw`
        const int SOIL_PIN = 34;                      // ADC1: usable with Wi-Fi on
        const int RAW_DRY = 2900;                     // the raw reading in dry air: measure yours
        const int RAW_WET = 1300;                     // the raw reading in a glass of water: measure yours

        int readRaw() {                               // the average of 16 readings
          long sum = 0;
          for (int i = 0; i < 16; i++) {
            sum += analogRead(SOIL_PIN);
            delay(2);
          }
          return sum / 16;
        }

        void setup() {
          Serial.begin(115200);
          analogSetPinAttenuation(SOIL_PIN, ADC_11db);
        }

        void loop() {
          int raw = readRaw();
          int pct = constrain(map(raw, RAW_DRY, RAW_WET, 0, 100), 0, 100);   // dry = 0 %, wet = 100 %
          Serial.printf("raw %d  moisture %d %%\n", raw, pct);
          delay(1000);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        soil = ADC(Pin(34), atten=ADC.ATTN_11DB)      # ADC1: usable with Wi-Fi on
        RAW_DRY = 2900                                # the raw reading in dry air: measure yours
        RAW_WET = 1300                                # the raw reading in a glass of water: measure yours

        def read_raw():                               # the average of 16 readings, as 12-bit counts
            total = 0
            for _ in range(16):
                total += soil.read_u16() >> 4
                time.sleep_ms(2)
            return total // 16

        while True:
            raw = read_raw()
            pct = (raw - RAW_DRY) * 100 // (RAW_WET - RAW_DRY)    # dry = 0 %, wet = 100 %
            pct = max(0, min(100, pct))
            print("raw %d  moisture %d %%" % (raw, pct))
            time.sleep(1)
      `,
      output: `
        raw 2874  moisture 2 %
        raw 1980  moisture 58 %
      `,
      notes: ['The two constants are placeholders: write down your own readings in air and in water, with the probe inserted to its mark.', 'Power the probe from a GPIO (or through a MOSFET) and switch it on only for the reading to save battery and, for resistive probes, the electrodes.']
    },
    {
      title: 'Count pulses from a flow meter',
      about: 'An interrupt counts every pulse of a YF-S201; once a second the program turns the count into litres per minute and adds it to a running total.',
      needs: 'An ESP32 DevKit and a YF-S201 flow meter (5 V supply, open-collector signal).',
      wiring: [['GPIO27', 'flow meter signal (yellow)', 'internal pull-up to 3.3 V; add 10 kΩ on a long cable'], ['5V (VIN)', 'flow meter VCC (red)'], ['GND', 'flow meter GND (black)']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (27) as [input with pull-up v]
          set [pulses v] to (0)
          set [litres v] to (0)
        when pin (27) goes [low v]
          change [pulses v] by (1)
        every (1) seconds
          set [n v] to (pulses)
          set [pulses v] to (0)
          change [litres v] by ((n) / (450))
          print (join (round ((n) * (60) / (450) * (100)) / (100)) [ L/min   total ] (litres) [ L])
      `,
      cpp: String.raw`
        const int FLOW_PIN = 27;                      // YF-S201 signal: open collector, internal pull-up
        const float PULSES_PER_LITRE = 450.0;         // about 7.5 Hz per L/min: calibrate your own meter
        volatile uint32_t pulses = 0;
        uint32_t lastMs = 0;
        float litres = 0;

        void IRAM_ATTR onPulse() {
          pulses++;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(FLOW_PIN, INPUT_PULLUP);
          attachInterrupt(digitalPinToInterrupt(FLOW_PIN), onPulse, FALLING);
        }

        void loop() {
          if (millis() - lastMs >= 1000) {
            noInterrupts();
            uint32_t n = pulses;                      // take the count and restart it
            pulses = 0;
            interrupts();
            lastMs += 1000;
            litres += n / PULSES_PER_LITRE;
            Serial.printf("%.2f L/min   total %.2f L\n", n / PULSES_PER_LITRE * 60.0, litres);
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        import machine, time

        PULSES_PER_LITRE = 450.0                      # about 7.5 Hz per L/min: calibrate your own meter
        pulses = 0

        def on_pulse(pin):
            global pulses
            pulses += 1

        flow = Pin(27, Pin.IN, Pin.PULL_UP)           # YF-S201 signal: open collector
        flow.irq(trigger=Pin.IRQ_FALLING, handler=on_pulse)
        litres = 0.0
        last = time.ticks_ms()

        while True:
            if time.ticks_diff(time.ticks_ms(), last) >= 1000:
                state = machine.disable_irq()         # take the count and restart it
                n = pulses
                pulses = 0
                machine.enable_irq(state)
                last = time.ticks_add(last, 1000)
                litres += n / PULSES_PER_LITRE
                print("%.2f L/min   total %.2f L" % (n / PULSES_PER_LITRE * 60, litres))
            time.sleep_ms(20)
      `,
      output: `
        0.00 L/min   total 0.00 L
        4.27 L/min   total 0.07 L
        4.31 L/min   total 0.14 L
      `,
      notes: ['To calibrate, run exactly 5 litres through the meter and divide the pulses counted by 5: that is your pulses per litre.', 'For fast or long-running counts use the hardware pulse counter ([[pulse-counting]]) rather than an interrupt per pulse.']
    }
  ],
  quiz: [
    { q: 'A capacitive soil probe reads 2900 in dry air and 1300 in water. In a pot it reads 2100. Roughly what moisture does the program report?', choices: ['0 %', '25 %', '50 %', '100 %'], a: 2, why: 'The reading is halfway between the dry and the wet value: (2100 − 2900) ÷ (1300 − 2900) = 0.5.' },
    { q: 'Why is a resistive soil probe powered from a GPIO only during the reading?', choices: ['To save a pin', 'DC current corrodes the prongs by electrolysis, so the less time it flows the longer the probe lasts', 'GPIOs give a cleaner voltage', 'The ADC needs it'], a: 1, why: 'A direct current through wet soil dissolves one electrode. Short pulses, or alternating polarity, make the probe last.' },
    { q: 'A pressure transducer on the floor of a tank reads 19.6 kPa of gauge pressure. How deep is the water?', choices: ['0.5 m', '1 m', '2 m', '4 m'], a: 2, why: 'p = ρgh gives h = 19 600 ÷ (1000 × 9.81) = 2.0 m, about 9.8 kPa per metre.' },
    { q: 'The K-factor printed in a flow meter\'s datasheet is exact for your meter.', a: false, why: 'Each meter differs, and the factor changes with flow rate and plumbing. Catch a measured volume and compute your own pulses per litre.' }
  ],
  applications: [
    'Automatic plant watering and irrigation controllers ([[project-plant-watering]]).',
    'Rain-barrel and header-tank level monitoring with a notification when it is low.',
    'Leak detection under sinks and washing machines with a conductive rope or a pair of pads.',
    'Water-use metering for gardens, workshops and fish farms.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, ADC calibration and the PCNT peripheral: reading probes and counting pulses.',
    'Datasheet of the YF-S201 Hall-effect water flow sensor: pulse rate against flow and the operating range.',
    'ISO 4064, *Water meters for cold potable water and hot water*: why a meter is calibrated against a measured volume.'
  ]
},

/* ================================================================ gnss-receivers */
{
  id: 'gnss-receivers',
  parent: 'sensing-the-world',
  title: 'GNSS receivers',
  level: 2,
  short: 'A GNSS module listens to satellites and prints its position, time and speed as lines of text on a UART. It needs a clear sky and, from cold, minutes to find itself; the ESP32 only has to read and check the NMEA lines.',
  keywords: ['GNSS', 'GPS', 'GLONASS', 'Galileo', 'BeiDou', 'NMEA', 'GGA', 'RMC', 'u-blox', 'NEO-6M', 'ATGM336H', 'fix', 'HDOP', 'cold start', 'hot start', 'PPS', 'antenna', 'latitude', 'longitude', 'checksum', 'TinyGPSPlus'],
  prereq: ['choosing-a-sensor', 'uart-on-the-esp', 'strings-and-text'],
  related: ['reading-sensors-reliably', 'ntp-and-time', 'privacy-and-data-protection', 'project-lora-field-sensor', 'external-antennas', 'cellular-iot'],
  body: `GNSS means *global navigation satellite system*: GPS (USA), GLONASS (Russia), Galileo (Europe) and BeiDou (China). A receiver finds four or more satellites, measures how long their signals took to arrive, and solves for position and time. The ESP32 has no GNSS of its own; a small module does the hard work and reports on a UART.

### What the module says

It sends **NMEA 0183** sentences, plain text lines at 9600 baud and once a second by default:

| Sentence | Carries |
|---|---|
| GGA | time, latitude, longitude, fix quality, satellites used, HDOP, altitude |
| RMC | time, date, valid flag (A or V), position, speed in knots, course |
| GSA, GSV | fix type and dilution of precision; satellites in view |

The two letters before the sentence name say who spoke: GP for GPS, GL, GA, GB, and GN for a combination. Latitude is written as ddmm.mmmm: 4807.038 N is 48° plus 7.038 minutes, which is 48.1173°. Each line closes with * and two hex digits, a checksum: the XOR of every character between \\$ and *. A line that fails it is noise.

### Fix, accuracy and time

A **fix** needs sky: a module on a desk indoors usually never gets one. A **cold start** (no stored satellite data or time) takes from tens of seconds to several minutes outdoors; a backup battery on the module keeps the data and gives a hot start of a second or two. A cheap module such as the u-blox NEO-6M or the ATGM336H is good to about 2.5 m horizontally under open sky, worse vertically, worse still among buildings. **HDOP** says how favourable the geometry is: below 2 is good. Speed comes from the Doppler shift and is better than speed from successive positions; the heading is meaningless at walking pace or less. A **PPS** pin gives one pulse per second aligned to UTC to tens of nanoseconds: a timing source for other devices ([[ntp-and-time]]).

### Antenna and wiring

The signals are far weaker than noise (about −130 dBm), so the antenna matters: a ceramic patch facing the sky on a ground plane of a few centimetres, or an active antenna on a cable. Keep it away from the Wi-Fi antenna, a switching regulator and the display. The module runs from 3.3 V and draws 30–50 mA while acquiring. Where you are is personal data: handle it as such ([[privacy-and-data-protection]]).

> [!key] A GNSS module needs a sky view and a patient cold start, then streams NMEA text. Verify each line's checksum, read the fix flag and HDOP before trusting a position, and remember that heading and low-speed data are unreliable.`,
  ideas: [
    'GNSS modules report position, time and speed as NMEA text lines over a UART, once a second by default.',
    'A fix needs open sky; a cold start can take minutes, while a backup battery gives a hot start in seconds.',
    'A cheap module is good to a few metres horizontally; check the fix flag, the satellite count and HDOP.',
    'Every NMEA line carries a checksum; ignore lines that fail it.'
  ],
  pitfalls: [
    'A GNSS module works on a desk indoors — The signals are weaker than noise and need a view of the sky; indoors it may never find a fix.',
    'Latitude 4807.038 is 48.07038° — NMEA writes degrees and minutes: 48° and 7.038′, which is 48.1173°.',
    'The heading is always meaningful — It comes from movement, so at a standstill or a walking pace it is random; use a magnetometer or an IMU there.'
  ],
  terms: [
    { term: 'GNSS', also: ['GPS', 'GLONASS', 'Galileo', 'BeiDou'], def: 'Global navigation satellite system: a constellation of satellites from which a receiver computes position and time. GPS is the American one.' },
    { term: 'NMEA 0183', also: ['NMEA sentence', 'GGA', 'RMC'], def: 'A text protocol in which a GNSS module sends lines such as \\$GPGGA,… with comma-separated fields and a closing checksum.' },
    { term: 'Fix', also: ['3D fix', 'fix quality'], def: 'A valid position solution. A 2D fix uses three satellites and no altitude; a 3D fix uses four or more.' },
    { term: 'HDOP', also: ['dilution of precision', 'DOP'], def: 'A number saying how the geometry of the satellites in view affects horizontal accuracy: the lower, the better; under 2 is good.' },
    { term: 'Cold start', also: ['warm start', 'hot start', 'TTFF'], def: 'Finding a first fix with no stored almanac or time, which takes minutes; a hot start with data kept by a backup battery takes seconds.' }
  ],
  choose: {
    good: ['u-blox NEO-6M, NEO-M8N or MAX-M10S: well documented, many libraries', 'ATGM336H or L76-class modules: low-cost GPS plus BeiDou', 'A module with an external active antenna for enclosures', 'A backup battery on the module for fast restarts'],
    avoid: ['Testing on a desk indoors and calling the module faulty', 'Trusting position with HDOP above 5 or fewer than four satellites', 'Using GNSS heading at a standstill', 'Putting the antenna beside the Wi-Fi antenna or a switching regulator'],
    check: ['The baud rate (9600 usual) and update rate', 'The fix flag and satellite count in every sentence', 'The supply current while acquiring', 'The rules on collecting and storing location data']
  },
  examples: [
    {
      title: 'Read a GGA sentence',
      q: 'Decode \\$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47: the time, position, quality and number of satellites.',
      steps: ['Fields are separated by commas: time 12:35:19 UTC; latitude 4807.038 N; longitude 01131.000 E; quality 1 (a normal fix); 08 satellites; HDOP 0.9; altitude 545.4 m.', { text: 'Latitude: 48° plus 7.038 minutes,', tex: '48 + \\frac{7.038}{60} = 48.1173^\\circ\\ \\mathrm{N}' }, { text: 'Longitude: 11° plus 31.000 minutes,', tex: '11 + \\frac{31.000}{60} = 11.5167^\\circ\\ \\mathrm{E}' }, 'The checksum is the XOR of the characters between \\$ and *: here 0x47.'],
      a: '12:35:19 UTC, 48.1173° N, 11.5167° E, a good fix (quality 1, HDOP 0.9) from 8 satellites, at 545 m.'
    }
  ],
  code: [
    {
      title: 'Position from the NMEA lines of a GNSS module',
      about: 'Reads lines from the module, discards any whose checksum fails, and prints latitude, longitude, satellites and altitude from each GGA sentence that has a fix. No library is needed.',
      needs: 'An ESP32 DevKit and a GNSS module (NEO-6M or similar) with a clear view of the sky.',
      wiring: [['GPIO26', 'module TX', 'our receive pin'], ['GPIO27', 'module RX', 'our transmit pin'], ['3V3', 'module VCC'], ['GND', 'module GND']],
      blocks: `
        when started
          start serial at (115200) baud
          start UART (2) at (9600) baud on RX (26) TX (27)
        forever
          set [line v] to (read a line from UART (2))
          if <<(checksum of (line) is correct)> and <(line) contains [GGA]>> then
            set [f v] to (split (line) at [,])
            if <<(item (7) of [f v]) = [0]> or <(item (7) of [f v]) = [ ]>> then
              print [no fix yet]
            else
              print (join (degrees of (item (3) of [f v]) (item (4) of [f v])) [, ] (degrees of (item (5) of [f v]) (item (6) of [f v])) [  satellites ] (item (8) of [f v]) [  altitude ] (item (10) of [f v]) [ m])
            end
          end
        end
      `,
      cpp: String.raw`
        // GNSS module TX -> GPIO26 (our RX), module RX -> GPIO27 (our TX)
        double toDegrees(const String &v, const String &hemi) {      // "4807.038" and "N" -> 48.1173
          int dot = v.indexOf('.');
          double d = v.substring(0, dot - 2).toDouble() + v.substring(dot - 2).toDouble() / 60.0;
          return (hemi == "S" || hemi == "W") ? -d : d;
        }

        bool checksumOk(const String &line) {                        // XOR of everything between $ and *
          int star = line.indexOf('*');
          if (line.charAt(0) != '$' || star < 0 || star + 3 > (int)line.length()) return false;
          uint8_t x = 0;
          for (int i = 1; i < star; i++) x ^= line.charAt(i);
          return x == (uint8_t)strtol(line.substring(star + 1, star + 3).c_str(), nullptr, 16);
        }

        void setup() {
          Serial.begin(115200);
          Serial2.begin(9600, SERIAL_8N1, 26, 27);                   // baud, config, RX pin, TX pin
        }

        void loop() {
          if (!Serial2.available()) return;
          String line = Serial2.readStringUntil('\n');
          line.trim();
          if (!checksumOk(line) || !line.substring(3, 6).equals("GGA")) return;
          String f[10];                                              // split at the commas
          int n = 0, start = 0;
          for (int i = 0; i <= (int)line.length() && n < 10; i++) {
            if (i == (int)line.length() || line.charAt(i) == ',') {
              f[n++] = line.substring(start, i);
              start = i + 1;
            }
          }
          if (f[6] == "" || f[6] == "0") { Serial.println("no fix yet"); return; }
          Serial.printf("%.6f, %.6f  satellites %s  altitude %s m\n", toDegrees(f[2], f[3]), toDegrees(f[4], f[5]), f[7].c_str(), f[9].c_str());
        }
      `,
      py: String.raw`
        from machine import UART

        uart = UART(2, baudrate=9600, rx=26, tx=27, timeout=1500)    # module TX -> GPIO26, module RX -> GPIO27

        def to_degrees(v, hemi):                                     # "4807.038" and "N" -> 48.1173
            dot = v.index(".")
            d = float(v[:dot - 2]) + float(v[dot - 2:]) / 60
            return -d if hemi in ("S", "W") else d

        def checksum_ok(line):                                       # XOR of everything between $ and *
            star = line.find("*")
            if not line.startswith("$") or star < 0 or len(line) < star + 3:
                return False
            x = 0
            for ch in line[1:star]:
                x ^= ord(ch)
            return x == int(line[star + 1:star + 3], 16)

        while True:
            raw = uart.readline()                                    # None after the time-out
            if not raw:
                continue
            try:
                line = raw.decode().strip()
                if not checksum_ok(line) or line[3:6] != "GGA":
                    continue
            except ValueError:                                       # noise: bad characters or hex
                continue
            f = line.split(",")
            if f[6] in ("", "0"):
                print("no fix yet")
            else:
                print("%.6f, %.6f  satellites %s  altitude %s m" % (to_degrees(f[2], f[3]), to_degrees(f[4], f[5]), f[7], f[9]))
      `,
      output: `
        no fix yet
        no fix yet
        48.117300, 11.516667  satellites 8  altitude 545.4 m
      `,
      notes: ['Indoors the output stays at "no fix yet": go outside with a clear sky and wait, the first fix from cold can take several minutes.', 'The TinyGPSPlus library parses all sentences and gives `gps.location.lat()`, `gps.satellites.value()` and `gps.hdop.hdop()` if you prefer a library.', 'On a WROVER or other PSRAM module GPIO16 and GPIO17 are used by the memory, which is why this program uses GPIO26 and GPIO27.']
    }
  ],
  quiz: [
    { q: 'A new GNSS module on a desk indoors prints "no fix yet" for twenty minutes. What is the best next step?', choices: ['Replace the module', 'Move it where it has a clear view of the sky and wait a few minutes', 'Raise the baud rate', 'Add a pull-up resistor'], a: 1, why: 'Satellite signals are weaker than noise and do not penetrate roofs well. A cold start outdoors can take several minutes.' },
    { q: 'An NMEA sentence has latitude 5130.500 N. Which is the latitude in degrees?', choices: ['51.305°', '51.5083°', '513.05°', '51.0500°'], a: 1, why: 'The value is ddmm.mmm: 51° and 30.500 minutes, which is 51 + 30.5/60 = 51.5083°.' },
    { q: 'Which feature of a GNSS module gives a hot start within seconds after the ESP32 has been powered off for an hour?', choices: ['A larger antenna', 'A backup battery that keeps the satellite data and the time', 'A higher baud rate', 'The PPS pin'], a: 1, why: 'The stored almanac, ephemeris and time let the receiver skip the long search. The backup battery supplies only that memory and the real-time clock.' },
    { q: 'A GNSS module is a good compass for a robot that stands still.', a: false, why: 'Its course comes from the direction of movement. At a standstill or at walking pace it is meaningless; use a magnetometer or an IMU.' }
  ],
  applications: [
    'Asset and vehicle trackers that send a position over cellular, LoRa or Wi-Fi.',
    'Bike and hiking computers: speed, distance and track logs on an SD card.',
    'Timing sources: the PPS pin disciplines a clock or timestamps data on several nodes.',
    'Farm and survey equipment, with RTK modules for centimetre accuracy given correction data.'
  ],
  sources: [
    'NMEA 0183, *Standard for interfacing marine electronic devices*: the sentence formats and the checksum rule.',
    'u-blox, *NEO-6 data sheet* and *u-blox 6 receiver description*: default UART settings, start-up times and the supported messages.',
    'Espressif, *Arduino core documentation*, Serial API: assigning UART pins on the ESP32.'
  ]
}
,

/* ================================================================ sensor-calibration */
{
  id: 'sensor-calibration',
  parent: 'sensing-the-world',
  title: 'Calibration and offsets',
  level: 2,
  short: 'Every sensor is a little wrong in two simple ways: a constant offset and a gain. Measure it against something you trust at one point or two, correct it in software, and keep the constants where a reset cannot lose them.',
  keywords: ['calibration', 'offset', 'gain', 'two-point calibration', 'one-point calibration', 'tare', 'reference', 'ice bath', 'boiling point', 'salt humidity test', 'drift', 'linearity', 'Preferences', 'NVS', 'residual', 'zero', 'span'],
  prereq: ['choosing-a-sensor', 'nvs-and-preferences', 'accuracy-resolution-precision'],
  related: ['reading-sensors-reliably', 'adc-attenuation-and-calibration', 'load-cells-and-hx711', 'uncertainty-and-calibration', 'production-testing', 'motion-sensors-imu', 'math:linear-regression'],
  body: `Every sensor is a little wrong. **Calibration** means finding out *how* it is wrong by comparing it with something you trust, and correcting for it in software. Most of the errors of the sensors in this topic are of two kinds.

### Offset and gain

To a good approximation a sensor reports $y = g\\,x + b$: the true value $x$, a **gain** $g$ that should be 1, and an **offset** $b$ that should be 0.

- **Offset error** moves every reading by the same amount: a thermometer 0.8 °C high everywhere, a gyroscope that shows 0.5 °/s at rest, a scale that reads 30 g with nothing on it (the *tare*).
- **Gain error** scales the readings: a sensor that shows 5 % too much of everything, a flow meter's pulses per litre, a divider with the wrong resistors.
- **One-point calibration** removes the offset: measure at one known state (ice water, a still board, an empty scale) and subtract. **Two-point calibration** removes both: measure at two known states far apart, fit the straight line through them, and invert it (formula below; [the simulation](#/c/sensor-calibration?s=sim) shows the line).

### Getting a reference

A calibration is no better than its reference.

- **Ice bath:** crushed ice with a little water, stirred, gives 0 °C to a few tenths with care; keep the probe off the glass.
- **Boiling water:** 100 °C only at sea-level pressure; it falls about 1 °C for every 300 m of height and moves with the weather.
- **Humidity:** a sealed jar with a saturated salt solution holds a known RH: table salt about 75 % and magnesium chloride about 33 % at 25 °C, after several hours at a steady temperature.
- **Others:** a calibrated meter read at the same moment; known masses for a load cell; gravity itself for an accelerometer (1 g on each axis, board lying in six positions).

Choose points near the ends of the range you care about, then **check a third point in the middle**: the error there says whether a straight line is enough.

### Keeping the constants

- Store them in non-volatile memory ([[nvs-and-preferences]]) rather than in the source when each unit differs, and calibrate every unit in production ([[production-testing]]).
- Sensors drift with age, temperature and humidity: plan to recalibrate. Some chips help (the SCD4x has a forced recalibration command; the ESP32's ADC carries factory calibration in its eFuses, see [[adc-attenuation-and-calibration]]).
- Keep the residual: "calibrated at 0 and 100 °C, within ±0.3 °C at 50 °C" is a real specification.

> [!key] A sensor is wrong by an offset and a gain. Find them against references you trust at two points, check a third, store the constants where a reset cannot lose them, and remember that a calibration cannot beat its reference.`,
  ideas: [
    'Most sensor errors are an offset (a constant shift) and a gain (a wrong scale).',
    'One point removes the offset; two points far apart remove offset and gain; a third point checks the line.',
    'A reference must be better than the sensor: ice water, a saturated salt solution, a known mass, gravity.',
    'Store the constants in non-volatile memory, per unit, with the date and the residual.'
  ],
  pitfalls: [
    'Boiling water is exactly 100 °C — Only at sea-level pressure. A few hundred metres of height already lowers it by a degree.',
    'Two-point calibration makes the sensor accurate everywhere — Only if its response is a straight line. Check a third point in the middle; curved sensors (a thermistor) need more points or a model.',
    'Calibrate once and forget it — Sensors drift with age, heat and moisture, and the offset of a gyroscope changes with temperature; recalibrate on a schedule or at power-up.'
  ],
  terms: [
    { term: 'Offset', also: ['zero error', 'bias', 'tare'], def: 'An error that adds the same amount to every reading, such as a scale showing 30 g when empty. It is removed by subtracting the reading taken at a known zero.' },
    { term: 'Gain error', also: ['span error', 'scale factor'], def: 'An error that multiplies every reading by the same factor, such as a sensor showing 5 % too much. It is found by comparing with a known value away from zero.' },
    { term: 'Two-point calibration', also: ['one-point calibration', 'linear calibration'], def: 'Measuring a sensor at two known conditions, fitting the straight line through the two readings, and correcting later readings with it. It fixes both offset and gain.' },
    { term: 'Reference', also: ['standard', 'calibrator'], def: 'The trusted value used to calibrate a sensor: an ice bath, a calibrated instrument, a known mass. It must be more accurate than the sensor.' },
    { term: 'Residual', also: ['calibration error'], def: 'The error that remains at a test point after calibration. It shows how well a straight line describes the sensor.' }
  ],
  formulas: [
    {
      name: 'Two-point calibration',
      expr: 'y = rA + (x - xA)*(rB - rA)/(xB - xA)',
      tex: 'y = r_A + (x - x_A)\\,\\frac{r_B - r_A}{x_B - x_A}',
      vars: {
        y: { name: 'corrected value', tex: 'y' },
        x: { name: 'raw reading now', value: 2005, tex: 'x' },
        xA: { name: 'raw reading at reference A', value: 412, tex: 'x_A' },
        xB: { name: 'raw reading at reference B', value: 3580, tex: 'x_B' },
        rA: { name: 'true value at reference A', value: 0, tex: 'r_A' },
        rB: { name: 'true value at reference B', value: 100, tex: 'r_B' }
      },
      solveFor: 'y',
      note: 'The straight line through the two calibration points, written so that the raw reading becomes the true value. Units are whatever you chose; use the same unit for both raw readings and for both true values. Valid only while the sensor is linear.',
      stories: { y: 'A sensor read {xA} at the reference where the truth is {rA}, and {xB} where the truth is {rB}. It now reads {x}. What is the corrected value?' }
    }
  ],
  examples: [
    {
      title: 'A thermometer checked in ice and boiling water',
      q: 'A thermometer reads 2.0 °C in ice water and 97.0 °C in boiling water at an altitude of 300 m, where water boils at 99.0 °C. What is the true temperature when it reads 30.0 °C?',
      steps: [{ text: 'The two references are 0.0 and 99.0 °C. The gain is the true span over the measured span:', tex: 'g = \\frac{99.0 - 0.0}{97.0 - 2.0} = 1.042' }, { text: 'The corrected value of a reading $x$ is $r_A + g\\,(x - x_A)$:', tex: 'y = 0.0 + 1.042\\,(30.0 - 2.0) = 29.2\\ ^\\circ\\mathrm{C}' }, 'Had we used 100 °C for the boiling point, the result would be 29.5 °C: the reference altitude matters more than the arithmetic.'],
      a: 'The true temperature is 29.2 °C. The raw reading was 0.8 °C too high at this point.'
    }
  ],
  code: [
    {
      title: 'Two-point calibration with two buttons, stored in flash',
      about: 'Put the sensor in reference condition A and press button A; put it in condition B and press button B. The two raw readings (averaged, in millivolts) are saved in non-volatile memory and reload at every start. The program then prints the corrected value.',
      needs: 'An ESP32 DevKit, any analogue sensor on an ADC1 pin, and two push buttons.',
      wiring: [['GPIO34', 'sensor output', 'ADC1'], ['GPIO32', 'button A to GND', 'internal pull-up'], ['GPIO33', 'button B to GND', 'internal pull-up']],
      blocks: `
        when started
          start serial at (115200) baud
          set pin (32) as [input with pull-up v]
          set pin (33) as [input with pull-up v]
          set [rawA v] to (load [rawA])       // the saved constants survive a reset
          set [rawB v] to (load [rawB])
        forever
          if <(read pin (32)) = [LOW v]> then
            set [rawA v] to (average of (32) readings of (analog read pin (34) in millivolts))
            save (rawA) as [rawA]
            print (join [point A saved: ] (rawA) [ mV])
            wait (0.5) seconds
          end
          if <(read pin (33)) = [LOW v]> then
            set [rawB v] to (average of (32) readings of (analog read pin (34) in millivolts))
            save (rawB) as [rawB]
            print (join [point B saved: ] (rawB) [ mV])
            wait (0.5) seconds
          end
          set [mv v] to (average of (32) readings of (analog read pin (34) in millivolts))
          set [value v] to ((0) + ((((mv) - (rawA)) * ((100) - (0))) / ((rawB) - (rawA))))
          print (join (mv) [ mV -> ] (round ((value) * (10)) / (10)))
          wait (0.5) seconds
        end
      `,
      cpp: String.raw`
        #include <Preferences.h>

        const int SENSOR_PIN = 34;                    // any analogue sensor on ADC1
        const int BUTTON_A = 32, BUTTON_B = 33;       // to GND, internal pull-ups
        const float REF_A = 0.0, REF_B = 100.0;       // the TRUE values at the two reference conditions
        Preferences prefs;
        int rawA, rawB;                               // the sensor's readings in millivolts at A and B

        int readMv() {                                // the average of 32 readings
          long sum = 0;
          for (int i = 0; i < 32; i++) {
            sum += analogReadMilliVolts(SENSOR_PIN);
            delay(2);
          }
          return sum / 32;
        }

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON_A, INPUT_PULLUP);
          pinMode(BUTTON_B, INPUT_PULLUP);
          prefs.begin("calib", false);
          rawA = prefs.getInt("rawA", 0);             // the saved constants survive a reset
          rawB = prefs.getInt("rawB", 3300);
        }

        void loop() {
          if (digitalRead(BUTTON_A) == LOW) {
            rawA = readMv();
            prefs.putInt("rawA", rawA);
            Serial.printf("point A saved: %d mV\n", rawA);
            delay(500);
          }
          if (digitalRead(BUTTON_B) == LOW) {
            rawB = readMv();
            prefs.putInt("rawB", rawB);
            Serial.printf("point B saved: %d mV\n", rawB);
            delay(500);
          }
          int mv = readMv();
          float value = (rawB == rawA) ? 0 : REF_A + (mv - rawA) * (REF_B - REF_A) / (rawB - rawA);
          Serial.printf("%d mV -> %.1f\n", mv, value);
          delay(500);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import esp32, time

        sensor = ADC(Pin(34), atten=ADC.ATTN_11DB)    # any analogue sensor on ADC1
        button_a = Pin(32, Pin.IN, Pin.PULL_UP)       # to GND
        button_b = Pin(33, Pin.IN, Pin.PULL_UP)
        REF_A, REF_B = 0.0, 100.0                     # the TRUE values at the two reference conditions
        nvs = esp32.NVS("calib")

        def load(key, default):
            try:
                return nvs.get_i32(key)
            except OSError:
                return default

        def read_mv():                                # the average of 32 readings, in millivolts
            total = 0
            for _ in range(32):
                total += sensor.read_uv()
                time.sleep_ms(2)
            return total // 32000

        raw_a = load("rawA", 0)                       # the saved constants survive a reset
        raw_b = load("rawB", 3300)

        while True:
            if button_a.value() == 0:
                raw_a = read_mv()
                nvs.set_i32("rawA", raw_a)
                nvs.commit()                          # without commit() the value is lost
                print("point A saved:", raw_a, "mV")
                time.sleep_ms(500)
            if button_b.value() == 0:
                raw_b = read_mv()
                nvs.set_i32("rawB", raw_b)
                nvs.commit()
                print("point B saved:", raw_b, "mV")
                time.sleep_ms(500)
            mv = read_mv()
            value = 0 if raw_b == raw_a else REF_A + (mv - raw_a) * (REF_B - REF_A) / (raw_b - raw_a)
            print("%d mV -> %.1f" % (mv, value))
            time.sleep_ms(500)
      `,
      output: `
        point A saved: 412 mV
        point B saved: 2980 mV
        1204 mV -> 30.8
      `,
      notes: ['Storing the readings (not the corrected values) lets you change the reference values later without recalibrating.', 'Writes to flash wear it out: calibrate rarely, never in a loop ([[flash-wear]]).']
    }
  ],
  quiz: [
    { q: 'A gyroscope reads 0.5 °/s while the board lies perfectly still. What kind of error is this and how is it removed?', choices: ['Gain error: multiply by 2', 'Offset error: average the reading at rest and subtract it', 'Noise: nothing can be done', 'Drift: only a new sensor helps'], a: 1, why: 'A constant reading where the truth is zero is an offset. Measuring it at rest and subtracting it is a one-point calibration.' },
    { q: 'A humidity sensor in a sealed jar with saturated table salt at 25 °C reads 80 %. What should it read, and what does the 5-point difference tell you?', choices: ['75 %: it reads 5 points high at this humidity', '100 %: it reads 20 points low', '33 %: the jar failed', '50 %: nothing can be said'], a: 0, why: 'A saturated salt solution holds about 75 % RH at 25 °C. The sensor reads 5 points above that reference.' },
    { q: 'After calibrating a thermometer at 0 °C and 100 °C, you find it is 0.8 °C off at 50 °C. What does this tell you?', choices: ['The calibration was wrong', 'The sensor is not perfectly linear: a straight line through two points is not enough', 'The gain is correct', 'Boiling water is not 100 °C'], a: 1, why: 'A third point checks the line. A residual in the middle shows curvature; use more points or a model of the sensor (as for thermistors).' },
    { q: 'A reference thermometer that is less accurate than the sensor under calibration can still improve the sensor.', a: false, why: 'The calibration inherits the reference\'s error and adds its own. A reference should be several times better than what it calibrates.' }
  ],
  applications: [
    'Taring a kitchen scale or load cell before every weighing, and spanning it once with a known mass.',
    'Gyroscope bias at start-up of drones and balancing robots, with the board held still.',
    'Soil probes calibrated in air and water to give percentages.',
    'Production calibration of every unit with its constants stored in flash ([[production-testing]]).'
  ],
  sources: [
    'JCGM 100, *Guide to the expression of uncertainty in measurement* (GUM): references, residuals and combining errors.',
    'OIML R 121 / ASTM E104: the standard humidity of saturated salt solutions (sodium chloride about 75 %, magnesium chloride about 33 % at 25 °C).',
    'Espressif, *ESP-IDF Programming Guide*, ADC calibration and the NVS library.'
  ],
  sim: 'sw-twopoint'
},

/* ================================================================ reading-sensors-reliably */
{
  id: 'reading-sensors-reliably',
  parent: 'sensing-the-world',
  title: 'Reading sensors reliably',
  level: 2,
  short: 'Sensors fail quietly: a loose wire, a stuck bus, a spike. Check every return value, set time-outs, reject the impossible, take the median of several, keep the last good value with its age, and never block the program while a sensor thinks.',
  keywords: ['reliable', 'robust', 'plausibility', 'time-out', 'median filter', 'moving average', 'exponential filter', 'EMA', 'spike', 'stale data', 'retry', 'bus recovery', 'watchdog', 'NaN', 'noise', 'oversampling', 'non-blocking', 'error handling'],
  prereq: ['choosing-a-sensor', 'errors-and-exceptions', 'non-blocking-timing'],
  related: ['oversampling-and-noise', 'filtering-sensor-data', 'sensor-calibration', 'watchdogs', 'on-off-control-and-hysteresis', 'i2c-pull-ups-and-bus-problems', 'math:descriptive-statistics'],
  body: `A reading is the answer to a question asked of hardware, and hardware sometimes does not answer, answers late, or answers nonsense: a loose wire, a sensor that browned out, an I2C bus held low, a reading taken at the wrong moment. A program that assumes every reading is good will one day tell a customer it is −127 °C, or switch a heater fully on.

### Seven habits

1. **Check what comes back.** \`isnan()\`, the −127 of a missing DS18B20, \`None\` and \`OSError\` in MicroPython, the I2C result code, the CRC of a frame.
2. **Time-outs everywhere.** \`pulseIn\` with a limit, \`Wire.setTimeOut\`, UART reads that give up: no loop may wait for ever.
3. **Reject the impossible.** Plausibility limits (−40 to +80 °C, humidity 0–100 %) and a rate limit: a room does not change by 10 °C in a second.
4. **Filter.** The *median* of several readings throws away spikes; an *average* reduces steady noise.
5. **Keep the last good value and its age.** Say "stale" after a while instead of repeating an old number as if it were new.
6. **Do not block.** Start a conversion, do other work, come back ([[non-blocking-timing]]): one slow sensor must not stop the rest.
7. **Recover.** Retry; after several failures re-initialise the bus, or cut and restore the sensor's power through a transistor; and last of all, report the fault and let the watchdog restart the chip ([[watchdogs]]).

### Three filters

| Filter | Good against | Price |
|---|---|---|
| Median of N | single spikes and glitches | N readings per output; lag of about N/2 samples |
| Moving average of N | steady noise, reduced by √N | lag of (N−1)/2 samples; slow to follow a step |
| Exponential filter (α) | noise, with one number of memory | lag of about one time constant |

Take the median first (it removes the outliers), then average what is left. Do not filter away the very thing you want to detect, and do not average readings that are far apart in time. [The simulation](#/c/reading-sensors-reliably?s=sim) shows lag and noise together.

### How much averaging?

Random noise falls as $\\sigma/\\sqrt{N}$: sixteen readings quarter it, and a hundred and sixty-four more are needed for the next factor of two. Averaging does nothing for an offset ([[sensor-calibration]]) or for noise that is the same on every reading, and ADC oversampling needs some noise to work with ([[oversampling-and-noise]]).

> [!key] Treat every reading as a claim: check it, bound it, take a median of several, remember when it was taken, and never wait for a sensor with the whole program. A device that reports "no valid reading for 60 s" is better than one that confidently reports an old or impossible number.`,
  ideas: [
    'Every sensor read can fail: check return values, give every wait a time-out, and reject impossible values.',
    'A median of several readings removes spikes; an average reduces steady noise by √N.',
    'Keep the last good value together with its age, and report "stale" rather than an old number.',
    'Do not block the program while a sensor converts; retry, re-initialise the bus, and finally let a watchdog restart.'
  ],
  pitfalls: [
    'The reading is a number, so it is valid — A broken sensor still returns numbers (−127, 0, 4095, the last value). Check the return code, the range and the age.',
    'Averaging cures everything — It reduces random noise only. It spreads a spike over several outputs (use a median first) and cannot remove an offset.',
    'A longer delay makes a sensor read more reliably — A delay makes the whole program unresponsive; use the sensor\'s own conversion time, and do other work meanwhile.'
  ],
  terms: [
    { term: 'Plausibility check', also: ['range check', 'sanity check'], def: 'Rejecting a reading that the physical world cannot have produced: outside the sensor\'s range, or changing faster than the quantity possibly could.' },
    { term: 'Median filter', also: ['median of N'], def: 'Replacing a set of readings by the middle one when sorted. A single spike is always an extreme and so is discarded entirely.' },
    { term: 'Moving average', also: ['running mean', 'boxcar filter'], def: 'The mean of the last N readings, updated at every new one. It reduces random noise by √N but responds to a step with a delay of about N/2 readings.' },
    { term: 'Exponential filter', also: ['EMA', 'low-pass filter', 'single-pole filter'], def: 'A filter that moves the output a fraction α of the way to each new reading. It needs one stored number, and its time constant is about dt·(1−α)/α.' },
    { term: 'Stale data', also: ['data age', 'last good value'], def: 'A reading kept after the sensor has stopped delivering new ones. Storing the time of the last good reading lets the program mark it stale instead of passing it off as current.' }
  ],
  choose: {
    good: ['Median of 3 or 5 for spiky sensors (ADC, ultrasonic, DHT)', 'Moving average or an exponential filter for slow, steadily noisy values', 'A plausibility window and a rate limit on every reading', 'Timestamps and a "stale after" time on every value you report'],
    avoid: ['Blocking delays while a sensor converts', 'Reporting the previous value forever after failures, with no age', 'An average where a median is needed (spikes)', 'Heavy filtering of a signal you must react to quickly'],
    check: ['What each library returns on failure (NaN, −127, 0, None)', 'The time-out of every bus and pulse read', 'How long the filter delays a real step', 'What the device does after ten failures in a row']
  },
  formulas: [
    {
      name: 'Noise reduction by averaging',
      expr: 'sN = s/sqrt(N)',
      tex: 's_N = \\frac{s}{\\sqrt{N}}',
      vars: {
        sN: { name: 'noise after averaging', q: 'voltage', unit: 'mV', tex: 's_N' },
        s: { name: 'noise of a single reading (standard deviation)', q: 'voltage', unit: 'mV', value: 12, tex: 's' },
        N: { name: 'number of independent readings averaged', value: 16, int: true, min: 1, tex: 'N' }
      },
      solveFor: 'sN',
      note: 'For random noise that is independent from reading to reading. Offsets, drift and interference that repeats are not reduced.',
      stories: { sN: 'A reading of an ADC pin has a noise of {s}. After averaging {N} readings, what is the noise?', N: 'A single reading is noisy by {s}; you want {sN}. How many readings must be averaged?' }
    },
    {
      name: 'Exponential filter from a time constant',
      expr: 'alpha = dt/(tau + dt)',
      tex: '\\alpha = \\frac{\\Delta t}{\\tau + \\Delta t}',
      vars: {
        alpha: { name: 'filter coefficient', q: 'ratio', unit: '', tex: '\\alpha' },
        dt: { name: 'time between readings', q: 'time', unit: 'ms', value: 100, tex: '\\Delta t' },
        tau: { name: 'time constant wanted', q: 'time', unit: 's', value: 2, tex: '\\tau' }
      },
      solveFor: 'alpha',
      note: 'Each new reading moves the output a fraction α of the way: out = out + α (reading − out). After a step the output reaches 63 % in τ seconds.',
      stories: { alpha: 'A sensor is read every {dt} and the output should follow a step with a time constant of {tau}. Which α?' }
    }
  ],
  examples: [
    {
      title: 'Which filter for which fault?',
      q: 'An ultrasonic distance sensor mostly reads 118–122 cm but returns 245 cm about once in twenty readings. You average five readings: what does the output do when a spike is among them? And with the median of five?',
      steps: ['With a spike of 245 cm among four readings near 120 cm the average is $(4 \\times 120 + 245)/5 = 145$ cm: one bad reading moves every output that contains it by 25 cm for five outputs in a row.', 'The median of $\\{119, 120, 121, 122, 245\\}$ is 121: the spike is the largest value and is simply not chosen.', 'If you also wanted to smooth the 118–122 jitter, average the medians.'],
      a: 'The average is dragged to 145 cm for five consecutive outputs; the median stays at 121 cm. Use the median against spikes, the average against steady noise.'
    }
  ],
  code: [
    {
      title: 'A DHT22 read that is checked, bounded and aged',
      about: 'Reads every 2.5 s, accepts a value only if it is plausible and does not jump more than 5 degrees (unless three readings in a row agree), keeps the last good value, and prints it with its age and the number of failures since the last good one.',
      needs: 'An ESP32 DevKit and a DHT22 module.',
      libs: ['DHT sensor library', 'Adafruit Unified Sensor'],
      wiring: [['GPIO4', 'DHT22 data'], ['3V3', 'DHT22 VCC'], ['GND', 'DHT22 GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set [lastT v] to (nothing)
          set [failures v] to (0)
        every (2.5) seconds
          set [t v] to (DHT22 temperature on pin (4))
          set [h v] to (DHT22 humidity on pin (4))
          set [good v] to <<<(t) is a number> and <(h) is a number>> and <<(t) > (-40)> and <(t) < (80)>>>
          if <<good> and <<(lastT) is nothing> or <<(absolute value of ((t) - (lastT))) < (5)> or <(failures) ≥ (3)>>>> then
            set [lastT v] to (t)
            set [lastH v] to (h)
            set [lastGood v] to (milliseconds since start)
            set [failures v] to (0)
          else
            change [failures v] by (1)
          end
          if <(lastT) is nothing> then
            print [no valid reading yet]
          else
            print (join (lastT) [ C  ] (lastH) [ %RH  age ] (((milliseconds since start) - (lastGood)) / (1000)) [ s])
          end
      `,
      cpp: String.raw`
        #include <DHT.h>

        DHT dht(4, DHT22);
        float lastT = NAN, lastH = NAN;               // the last good readings
        uint32_t lastGoodMs = 0, lastTryMs = 0;
        int failures = 0;

        bool plausible(float t, float h) {            // numbers the physical world can produce
          return !isnan(t) && !isnan(h) && t > -40 && t < 80 && h >= 0 && h <= 100;
        }

        void setup() {
          Serial.begin(115200);
          dht.begin();
        }

        void loop() {
          uint32_t now = millis();
          if (now - lastTryMs < 2500) return;         // never ask a DHT22 faster than every 2 s
          lastTryMs = now;
          float t = dht.readTemperature(), h = dht.readHumidity();
          if (plausible(t, h) && (isnan(lastT) || fabs(t - lastT) < 5 || failures >= 3)) {
            lastT = t; lastH = h; lastGoodMs = now; failures = 0;     // accepted
          } else {
            failures++;                               // rejected: keep the old value
          }
          if (isnan(lastT)) Serial.println("no valid reading yet");
          else Serial.printf("%.1f C  %.1f %%RH  age %lu s  failures %d\n", lastT, lastH, (unsigned long)((now - lastGoodMs) / 1000), failures);
        }
      `,
      py: String.raw`
        from machine import Pin
        import dht, time

        sensor = dht.DHT22(Pin(4))
        last_t = last_h = None                        # the last good readings
        last_good = last_try = time.ticks_ms()
        failures = 0

        def plausible(t, h):                          # numbers the physical world can produce
            return -40 < t < 80 and 0 <= h <= 100

        while True:
            now = time.ticks_ms()
            if time.ticks_diff(now, last_try) >= 2500:    # never ask a DHT22 faster than every 2 s
                last_try = now
                try:
                    sensor.measure()
                    t, h = sensor.temperature(), sensor.humidity()
                    ok = plausible(t, h) and (last_t is None or abs(t - last_t) < 5 or failures >= 3)
                except OSError:
                    ok = False                        # the sensor did not answer
                if ok:
                    last_t, last_h, last_good, failures = t, h, now, 0      # accepted
                else:
                    failures += 1                     # rejected: keep the old value
                if last_t is None:
                    print("no valid reading yet")
                else:
                    age = time.ticks_diff(now, last_good) // 1000
                    print("%.1f C  %.1f %%RH  age %d s  failures %d" % (last_t, last_h, age, failures))
            time.sleep_ms(50)
      `,
      output: `
        no valid reading yet
        21.8 C  47.3 %RH  age 0 s  failures 0
        21.8 C  47.3 %RH  age 5 s  failures 2
      `,
      notes: ['Three rejected readings in a row are accepted as real after all: a sensor moved from a cold room to a warm one really does jump.', 'After many failures in a row, report a fault to the user (a status flag, an MQTT message) rather than printing the old value for ever.']
    },
    {
      title: 'Median of five, a range check and a smoothing filter',
      about: 'Reads an analogue pin five times, takes the middle value so that a single spike is thrown away, rejects values outside the sensor\'s possible range, and smooths the rest with an exponential filter.',
      needs: 'An ESP32 DevKit and any analogue sensor on an ADC1 pin.',
      wiring: [['GPIO34', 'sensor output', 'ADC1'], ['3V3', 'sensor VCC'], ['GND', 'sensor GND']],
      blocks: `
        when started
          start serial at (115200) baud
          set [smooth v] to (-1)
        every (0.2) seconds
          set [mv v] to (median of (5) readings of (analog read pin (34) in millivolts))
          if <<(mv) < (50)> or <(mv) > (3200)>> then
            print [out of range: wiring fault?]
          else
            if <(smooth) < (0)> then
              set [smooth v] to (mv)
            else
              change [smooth v] by ((0.2) * ((mv) - (smooth)))
            end
            print (join (mv) [ mV  smoothed ] (round (smooth)) [ mV])
          end
      `,
      cpp: String.raw`
        const int PIN = 34;                           // ADC1 channel
        float smooth = -1;                            // the exponential filter's memory

        int medianOf5() {
          int v[5];
          for (int i = 0; i < 5; i++) {
            v[i] = analogReadMilliVolts(PIN);
            delay(2);
          }
          for (int i = 1; i < 5; i++) {               // a tiny insertion sort
            int x = v[i], j = i - 1;
            while (j >= 0 && v[j] > x) { v[j + 1] = v[j]; j--; }
            v[j + 1] = x;
          }
          return v[2];                                // the middle one: a single spike is discarded
        }

        void setup() {
          Serial.begin(115200);
        }

        void loop() {
          int mv = medianOf5();
          if (mv < 50 || mv > 3200) {                 // outside what the sensor can produce
            Serial.println("out of range: wiring fault?");
          } else {
            smooth = (smooth < 0) ? mv : smooth + 0.2 * (mv - smooth);   // alpha = 0.2
            Serial.printf("%d mV  smoothed %.0f mV\n", mv, smooth);
          }
          delay(200);
        }
      `,
      py: String.raw`
        from machine import ADC, Pin
        import time

        adc = ADC(Pin(34), atten=ADC.ATTN_11DB)       # ADC1 channel
        smooth = None                                 # the exponential filter's memory

        def median_of_5():
            v = []
            for _ in range(5):
                v.append(adc.read_uv() // 1000)       # millivolts
                time.sleep_ms(2)
            return sorted(v)[2]                       # the middle one: a single spike is discarded

        while True:
            mv = median_of_5()
            if mv < 50 or mv > 3200:                  # outside what the sensor can produce
                print("out of range: wiring fault?")
            else:
                smooth = mv if smooth is None else smooth + 0.2 * (mv - smooth)   # alpha = 0.2
                print("%d mV  smoothed %.0f mV" % (mv, smooth))
            time.sleep_ms(200)
      `,
      output: `
        1652 mV  smoothed 1652 mV
        1655 mV  smoothed 1653 mV
        out of range: wiring fault?
      `,
      notes: ['With α = 0.2 and a reading every 0.2 s the time constant is about 0.8 s (dt·(1−α)/α).', 'The 50 mV and 3200 mV limits are for an ESP32 at 11 dB attenuation: a reading at either end usually means a disconnected or shorted sensor.']
    }
  ],
  quiz: [
    { q: 'A sensor mostly reads 120 cm but returns 245 cm once in twenty readings. Which filter removes the spikes completely?', choices: ['A moving average of 5', 'A median of 5', 'An exponential filter with α = 0.5', 'No filter can'], a: 1, why: 'A single spike is always the largest value of the five, so the median never picks it. An average or an exponential filter spreads the spike over several outputs.' },
    { q: 'A program shows the last good humidity value for ever when the DHT22 fails. What should it do instead?', choices: ['Nothing: the old value is the best guess', 'Report the age of the value and mark it stale after some time', 'Show zero', 'Delay for ten seconds'], a: 1, why: 'The age lets the user (or the cloud) see that the number is old. A device that says "no valid reading for 60 s" can be trusted; one that quietly repeats an old number cannot.' },
    { q: 'How many independent readings must be averaged to cut random noise to a quarter?', choices: ['4', '8', '16', '64'], a: 2, why: 'Noise falls as 1/√N, so a quarter needs √N = 4, N = 16.' },
    { q: 'Averaging 100 readings also removes a constant offset of the sensor.', a: false, why: 'Averaging reduces random noise only. An offset is the same in every reading and survives any amount of averaging; calibration removes it.' }
  ],
  applications: [
    'Any sensor in a product that must run for months unattended, from thermostats to field loggers.',
    'Ultrasonic and ADC readings in robots, where a single spike must not make a motor jump.',
    'Reporting to the cloud with a data age and a status flag, so a dashboard can show "sensor offline".',
    'Gating alarms and heaters on two things at once: a plausible value and a recent one.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*: task watchdog and the I2C and ADC driver error codes.',
    'MicroPython documentation, *Quick reference for the ESP32*: the `dht`, `ADC` and `I2C` classes and their exceptions.',
    'JCGM 100, *Guide to the expression of uncertainty in measurement*: why averaging reduces random errors by √N and not systematic ones.'
  ],
  sim: 'sw-filters'
}
);
