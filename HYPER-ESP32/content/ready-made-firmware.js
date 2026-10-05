/* HYPER-ESP32 · content/ready-made-firmware.js
 *
 * Topic "Ready-made firmware": ESPHome, Tasmota, WLED, Home Assistant and its integrations, ESPEasy and OpenMQTTGateway,
 * FluidNC, voice-assistant and audio-player firmware, flashing from the browser, and when to write your own.
 * Versions are those of the API crib (October 2026): ESPHome 2026.9, Tasmota 15.6, WLED 16.0, ESP Web Tools 10.4.
 * Simulations: sims/ready-made-firmware.js (ids rf-…).
 */
Hyper.add(
/* ================================================================ esphome */
{
  id: 'esphome',
  parent: 'ready-made-firmware',
  title: 'ESPHome',
  level: 1,
  short: 'ESPHome turns a short YAML file into firmware for an ESP: you say which parts are on which pins, and it builds the program, puts the device on your network and hands it to Home Assistant. No C++ unless you want some.',
  keywords: ['ESPHome', 'YAML', 'Device Builder', 'dashboard', 'Home Assistant', 'native API', 'OTA', 'lambda', 'substitutions', 'packages', '!secret', 'on_press', 'filters', 'no code', 'compile', 'esphome run'],
  prereq: ['choosing-a-framework', 'wifi-basics', 'iot-architecture'],
  related: ['tasmota', 'wled', 'home-assistant-integration', 'web-flashing', 'build-or-use', 'reflashing-commercial-devices', 'home-assistant-voice-hardware', 'ota-updates', 'mdns'],
  body: `Suppose you want a temperature sensor on a shelf to appear in your smart-home app. Written by hand it is a program of forty lines: join the Wi-Fi, rejoin when it drops, read the sensor, format a message, send it, accept new firmware. ESPHome's idea is that all of that is the same for everyone, so it asks only for the part that is yours: *which sensor, on which pin, how often*.

### A file in, firmware out

You write a configuration in **YAML**, a plain-text format of nested names and values. Each block names a **component** and its options: \`wifi:\`, \`sensor:\` with a platform, \`switch:\`, \`light:\`. ESPHome's tool checks the file, **generates C++ from it**, compiles that for your chip and writes it to the board. The first install needs a cable. After that the device takes new firmware over Wi-Fi, so changing a pin or an interval is a quick edit-and-install with the board still on the shelf. The tool runs as the ESPHome Device Builder (an add-on of Home Assistant, or a container) or from the command line.

~~~yaml
sensor:
  - platform: dht
    pin: GPIO4
    model: DHT22
    temperature:
      name: "Greenhouse temperature"
    update_interval: 60s
~~~

### How it reaches Home Assistant

The device offers its parts over ESPHome's own **native API**: an encrypted connection on the local network, protected by a pre-shared key that you copy once. Home Assistant finds the device by mDNS, asks for the key and creates one entity per component, grouped as one device ([[home-assistant-integration]]). No broker is needed (MQTT is an alternative). Without Home Assistant the device still works: its automations run on the chip, and it can serve a small web page of its own.

### What the file can do

- **Filters** clean a value before it is reported: add an offset, average the last few readings, report only a change of a given size.
- **Automations** run on the device — \`on_press\`, \`on_value\`, an \`interval\`, a \`script\` — so a button still switches a light when the network is down.
- **Substitutions and packages** let similar devices share one file.
- **A lambda** is inline C++ for what the file's words cannot say; *external components* add drivers.

### Limits

It supports the chips the catalogue marks (the ESP32, S2, S3, C3, C6, C5, H2, P4 and ESP8266, not the C2 or C61), and its list of parts is long but finite. Every change builds a *whole* firmware and waits for a compile. It suits "sensors, switches, lights and displays reported to a hub" and is clumsy for an algorithm of your own with tight timing ([[build-or-use]]). Versions are numbered by year and month (2026.9 at the time of writing) and options get renamed, so copy a configuration from the documentation of your version.

> [!key] ESPHome compiles a YAML description of your parts into firmware, updates it over Wi-Fi and hands the device to Home Assistant over an encrypted API. Choose it when the job is "this sensor or switch, on that pin, in my smart home"; write code when the job is an algorithm.`,
  ideas: [
    'You describe the parts and their pins in YAML; ESPHome generates, compiles and uploads the C++ for you.',
    'The first install needs a cable; later changes go over Wi-Fi.',
    'Home Assistant finds the device by itself and talks to it over an encrypted native API.',
    'Automations live on the device, so it keeps working when the server or the network is down.'
  ],
  pitfalls: [
    `ESPHome is a programming language — It is a configuration format: a list of components and their options. It becomes C++ behind the scenes, and a lambda lets you write C++ where the format runs out.`,
    `Once installed, the device needs Home Assistant to work — Its automations run on the chip and it can serve its own web page. Home Assistant is only the most common client of the native API.`,
    `A configuration from an old tutorial will compile today — Options are renamed and removed between the monthly releases. The checker names the line it dislikes; take the example from the documentation of your version.`
  ],
  terms: [
    { term: 'ESPHome', also: ['esphome'], def: 'An open-source system that builds firmware for an ESP from a YAML description of its parts, installs it over USB or Wi-Fi, and connects the device to Home Assistant.' },
    { term: 'YAML', also: ['YAML file', 'configuration file'], def: 'A text format for nested settings, written with indentation and "name: value" lines. A wrong indent changes the meaning, so it is the first thing to check when a file is rejected.' },
    { term: 'Component', also: ['platform', 'ESPHome component'], def: 'One building block of an ESPHome file: a sensor, a switch, a light, a display or a service such as Wi-Fi. Each has options and generates the code that drives it.' },
    { term: 'Native API', also: ['ESPHome API', 'api component'], def: 'The encrypted connection through which an ESPHome device and Home Assistant exchange states and commands directly, protected by a pre-shared key.' },
    { term: 'Lambda', also: ['lambda expression', 'inline C++'], def: 'A short piece of C++ written inside an ESPHome file to compute a value or make a decision that the configuration options cannot express.' },
    { term: 'Secrets file', also: ['!secret', 'secrets.yaml'], def: 'A separate file that holds passwords and keys. The main file refers to them by name, so that it can be shared or published without leaking them.' }
  ],
  choose: {
    good: ['Sensors, switches, lights and displays that report to Home Assistant', 'Many similar devices that differ only in pins and names (packages and substitutions)', 'Makers who want to change a pin or an interval without setting up a compiler'],
    avoid: ['A product with an algorithm of its own and tight timing: write the program', 'Chips the catalogue does not mark as supported (the ESP32-C2 and C61)', 'A device that must stay tiny and fixed with no Wi-Fi code: the generated firmware includes a lot'],
    check: ['That every part you use has a component, and what it needs from the chip', 'The version you install: copy examples from its own documentation', 'Where the key and the passwords live: in the secrets file, not in the shared file']
  },
  code: [
    {
      title: 'A temperature sensor that appears in Home Assistant',
      about: 'Reads a DHT22 every 60 seconds and reports it. The ESPHome file does the whole job, including Wi-Fi, the encrypted API and over-the-air updates. The hand-written versions need an MQTT broker and send the two values as plain messages, so they are longer and say much less.',
      needs: 'An ESP32 DevKit and a DHT22 module (with its pull-up resistor). The hand-written versions also need an MQTT broker, such as the Mosquitto add-on of Home Assistant.',
      wiring: [['GPIO4', 'DHT22 data', 'a 4.7 kΩ to 10 kΩ pull-up to 3V3 (modules have one)'], ['3V3 and GND', 'DHT22 power']],
      libs: ['PubSubClient', 'DHT sensor library (Adafruit)', 'Adafruit Unified Sensor'],
      blocks: `
        when started
          connect to Wi-Fi [your-ssid] password [your-password]
          connect to MQTT broker [192.168.1.10]

        every (60) seconds
          publish (DHT22 temperature on pin (4)) to topic [home/greenhouse/temperature]
          publish (DHT22 humidity on pin (4)) to topic [home/greenhouse/humidity]
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <PubSubClient.h>
        #include <DHT.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const char *BROKER = "192.168.1.10";           // your MQTT broker
        const uint32_t INTERVAL_MS = 60000;            // update_interval: 60s

        DHT dht(4, DHT22);                             // data on GPIO4
        NetworkClient net;
        PubSubClient mqtt(net);
        uint32_t last = 0;

        void setup() {
          dht.begin();
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          mqtt.setServer(BROKER, 1883);
          last = millis() - INTERVAL_MS;               // so that the first reading goes out at once
        }

        void loop() {
          if (!mqtt.connected()) {
            if (!mqtt.connect("greenhouse")) { delay(2000); return; }
          }
          mqtt.loop();
          if (millis() - last >= INTERVAL_MS) {
            last = millis();
            float t = dht.readTemperature();
            float h = dht.readHumidity();
            if (!isnan(t) && !isnan(h)) {              // a failed read gives NaN: skip it
              mqtt.publish("home/greenhouse/temperature", String(t, 1).c_str());
              mqtt.publish("home/greenhouse/humidity", String(h, 1).c_str());
            }
          }
        }
      `,
      py: String.raw`
        import network, time, dht
        from machine import Pin
        from umqtt.robust import MQTTClient

        BROKER = "192.168.1.10"                        # your MQTT broker
        INTERVAL_MS = 60000                            # update_interval: 60s
        sensor = dht.DHT22(Pin(4))                     # data on GPIO4

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        mqtt = MQTTClient("greenhouse", BROKER)
        mqtt.connect()
        last = time.ticks_add(time.ticks_ms(), -INTERVAL_MS)   # so that the first reading goes out at once
        while True:
            if time.ticks_diff(time.ticks_ms(), last) >= INTERVAL_MS:
                last = time.ticks_ms()
                try:
                    sensor.measure()                   # raises OSError when the sensor does not answer
                    mqtt.publish(b"home/greenhouse/temperature", ("%.1f" % sensor.temperature()).encode())
                    mqtt.publish(b"home/greenhouse/humidity", ("%.1f" % sensor.humidity()).encode())
                except OSError:
                    pass                               # a failed read: try again next time
            time.sleep_ms(100)
      `,
      yaml: `
        esphome:
          name: greenhouse

        esp32:
          board: esp32dev

        wifi:
          ssid: !secret wifi_ssid
          password: !secret wifi_password

        api:
          encryption:
            key: !secret api_key

        ota:
          - platform: esphome

        logger:

        sensor:
          - platform: dht
            pin: GPIO4
            model: DHT22
            temperature:
              name: "Greenhouse temperature"
            humidity:
              name: "Greenhouse humidity"
            update_interval: 60s
      `,
      notes: ['The hand-written versions publish bare numbers to topics of their own invention; Home Assistant needs a sensor defined for them, or an MQTT discovery message ([[home-assistant-integration]]). ESPHome sends the same information through the native API with no extra step.', 'Use the board name of your hardware in the ESPHome file (for an ESP32-S3 or C3 board it is a different name, and the chip variant is set too). Keep the passwords in the secrets file and out of anything you share ([[credentials-handling]]).', 'The DHT22 cannot be read more often than every two seconds; 60 seconds is plenty for air.']
    },
    {
      title: 'A button that toggles a light, with the rule on the device',
      about: 'A push button on GPIO27 toggles an LED on GPIO26. In ESPHome the rule is three lines inside the button\'s own block, and it runs on the chip whether or not Home Assistant is reachable; the light also appears in Home Assistant, which can switch it too. The other versions are the same rule written by hand, without the network.',
      needs: 'An ESP32 DevKit, a push button and an LED with a resistor.',
      wiring: [['GPIO27', 'button → GND', 'internal pull-up'], ['GPIO26', '220 Ω → LED → GND']],
      blocks: `
        when started
          set pin (26) as [output v]
          set pin (27) as [input with pull-up v]
          set [lamp on v] to <false>
          set [was pressed v] to <false>
        forever
          set [pressed v] to <(read pin (27)) = [LOW v]>
          if <<(pressed)> and <not <was pressed>>> then
            set [lamp on v] to <not <lamp on>>
            set pin (26) to (lamp on)
            wait (0.03) seconds
          end
          set [was pressed v] to (pressed)
        end
      `,
      cpp: String.raw`
        const int LAMP = 26;                // GPIO26 → 220 Ω → LED → GND
        const int BUTTON = 27;              // GPIO27 → button → GND, internal pull-up

        bool lampOn = false;
        bool wasPressed = false;

        void setup() {
          pinMode(LAMP, OUTPUT);
          pinMode(BUTTON, INPUT_PULLUP);
        }

        void loop() {
          bool pressed = digitalRead(BUTTON) == LOW;
          if (pressed && !wasPressed) {     // the moment of the press, not the time it is held
            lampOn = !lampOn;               // on_press: light.toggle
            digitalWrite(LAMP, lampOn);
            delay(30);                      // a crude debounce
          }
          wasPressed = pressed;
        }
      `,
      py: String.raw`
        from machine import Pin
        import time

        lamp = Pin(26, Pin.OUT)             # GPIO26 → 220 Ω → LED → GND
        button = Pin(27, Pin.IN, Pin.PULL_UP)   # GPIO27 → button → GND

        lamp_on = False
        was_pressed = False

        while True:
            pressed = button.value() == 0
            if pressed and not was_pressed:     # the moment of the press, not the time it is held
                lamp_on = not lamp_on           # on_press: light.toggle
                lamp.value(lamp_on)
                time.sleep_ms(30)               # a crude debounce
            was_pressed = pressed
            time.sleep_ms(5)
      `,
      yaml: `
        esphome:
          name: hall-light

        esp32:
          board: esp32dev

        wifi:
          ssid: !secret wifi_ssid
          password: !secret wifi_password

        api:
          encryption:
            key: !secret api_key

        ota:
          - platform: esphome

        logger:

        output:
          - platform: gpio
            pin: GPIO26
            id: lamp_out

        light:
          - platform: binary
            name: "Hall light"
            output: lamp_out
            id: hall_light

        binary_sensor:
          - platform: gpio
            pin:
              number: GPIO27
              mode:
                input: true
                pullup: true
              inverted: true
            name: "Hall button"
            filters:
              - delayed_on: 30ms
            on_press:
              then:
                - light.toggle: hall_light
      `,
      notes: ['The ESPHome file has no loop and no timing code: the component reads the pin, the filter removes the bounce, the automation toggles the light. The network, the reconnection and the update service come with the file.', 'The three hand-written versions do only the local part. Adding Wi-Fi and a way to switch the lamp from a phone would multiply their length — which is the case for ready-made firmware.']
    }
  ],
  quiz: [
    { q: 'The device runs ESPHome and sits on a shelf. You change a pin in the file and press Install. What happens?', choices: ['Nothing, until you reflash it with a cable', 'The tool rebuilds the firmware and sends it to the device over Wi-Fi', 'Home Assistant edits the program inside the device', 'The old firmware keeps running until the router restarts'], a: 1, why: 'After the first install the device accepts new firmware over Wi-Fi (an over-the-air update). The tool generates and compiles the C++ again and sends the result; no cable is needed.' },
    { q: 'How does an ESPHome device normally reach Home Assistant?', choices: ['Through a cloud account', 'Through an MQTT broker, always', 'Over its own encrypted native API on the local network', 'By HTTP requests that Home Assistant sends every second'], a: 2, why: 'The native API is a direct, encrypted connection protected by a pre-shared key. MQTT is an optional alternative, not a requirement.' },
    { q: 'While Home Assistant is switched off, a button on an ESPHome device no longer toggles its light, because the automation lives in Home Assistant.', a: false, why: 'An automation written in the device\'s own file (on_press) is compiled into the firmware and runs on the chip. Only entities and rules defined in Home Assistant itself stop with it.' },
    { q: 'Which pair of chips does the catalogue mark as not supported by ESPHome?', choices: ['ESP32 and ESP32-S3', 'ESP32-C3 and ESP32-C6', 'ESP8266 and ESP32-H2', 'ESP32-C2 and ESP32-C61'], a: 3, why: 'The catalogue lists ESPHome support for the ESP32, S2, S3, C3, C6, C5, H2, P4 and the ESP8266, and marks the C2 and the C61 as unsupported at the time of writing.' }
  ],
  applications: [
    'Room sensors for temperature, humidity, light and air quality that report to Home Assistant.',
    'Smart plugs, relays and light switches flashed with ESPHome, with their rules kept on the device.',
    'Display panels and small touch screens that show Home Assistant entities.',
    'Voice satellites such as the Home Assistant Voice Preview Edition, which run ESPHome ([[home-assistant-voice-hardware]]).'
  ],
  sources: [
    'ESPHome documentation: the getting-started guide, the component index and the native API page (release 2026.9).',
    'Home Assistant documentation: the ESPHome integration.',
    'The datasheet of the sensor you use, for its timing (for the DHT22, the minimum interval between readings).'
  ],
  sim: 'rf-esphome-path'
},

/* ================================================================ tasmota */
{
  id: 'tasmota',
  parent: 'ready-made-firmware',
  title: 'Tasmota',
  level: 1,
  short: 'Tasmota is ready-made firmware for ESP8266 and ESP32 devices, above all switches, plugs and lamps. You choose pins in a web page instead of writing code, and control the device by web page, console commands, rules and MQTT.',
  keywords: ['Tasmota', 'Sonoff', 'MQTT', 'cmnd', 'stat', 'tele', 'rules', 'Rule1', 'RuleTimer', 'Backlog', 'template', 'module', 'web console', 'Berry', 'TelePeriod', 'Power', 'Teleperiod', 'LWT'],
  prereq: ['esphome', 'mqtt-topics-qos-retain', 'wifi-provisioning'],
  related: ['wled', 'home-assistant-integration', 'espeasy-and-openmqttgateway', 'shelly-sonoff-and-smart-plugs', 'reflashing-commercial-devices', 'switching-mains-safely', 'web-flashing', 'build-or-use'],
  body: `Tasmota grew out of the wish to take a cheap Wi-Fi switch away from its maker's cloud and make it answer on your own network. It is now a general firmware for the ESP8266 and the ESP32 family, with a build for each chip; version 15.6 is current at the time of writing, and the project's pages list the supported chips.

### Set up in a web page

You install Tasmota once, from the browser or with a flashing tool ([[web-flashing]]). On first start the device opens its own Wi-Fi network; you join it, choose your network on a captive portal ([[wifi-provisioning]]), and from then on everything is done in the device's web page. Its most important screen assigns a **function to each GPIO**: "Relay 1" on one pin, "Button 1" on another, "DHT22" on a third. A whole assignment is a **template**, a short piece of JSON that can be pasted in, and the community keeps databases of templates for commercial plugs and bulbs. No compiler is needed.

### Console, MQTT and the three topics

The web console accepts commands: \`Power\`, \`Status 0\`, \`MqttHost\`, \`Restart 1\`. The same commands arrive over MQTT, and the device answers in the same tree. With a device whose topic is \`lamp\`:

~~~text
cmnd/lamp/POWER    ON        a command to the device
stat/lamp/POWER    ON        its answer: the relay is now on
tele/lamp/STATE              telemetry, every 300 s by default (TelePeriod)
tele/lamp/LWT      Online    Offline when the device vanishes: the last will
~~~

That fixed vocabulary is why Tasmota fits so many hubs: anything that can send a message to \`cmnd/…\` can control it, and Home Assistant finds it by discovery ([[home-assistant-integration]]).

### Rules: behaviour without a program

A **rule** is "on this event, do that", written in the console. This one turns a lamp off ten minutes after it was switched on:

~~~text
Rule1 ON Power1#State=1 DO RuleTimer1 600 ENDON ON Rules#Timer=1 DO Power1 0 ENDON
Rule1 1
~~~

There are three rule sets, and several commands can be chained with \`Backlog\`. A rule on a sensor value is checked only when the sensor is reported, every telemetry period (300 seconds unless shortened). On an ESP32 the Berry scripting language goes further.

### Limits

Tasmota controls and reports; it does not run an algorithm of yours. Rules are short and awkward past a few lines. Old devices with 1 MB of flash need a small build first, then the full one. And each build includes only the sensors its maker chose.

> [!warn] Many Tasmota devices are mains plugs and switches. Opening one is work for someone who knows what it contains: never flash or probe it while it is plugged in, power it only from the serial adapter's 3.3 V, and close the case properly afterwards ([[reflashing-commercial-devices]], [[switching-mains-safely]]).

> [!key] Tasmota gives an ESP a web page for choosing pins, a console, MQTT topics (cmnd, stat, tele) and a small rule engine. Choose it for switches, plugs and lamps on an MQTT-based system; write code for logic of your own.`,
  ideas: [
    'Pins are assigned to functions in a web page or a template: no compiler is needed.',
    'Three MQTT topic families do everything: cmnd to command, stat for answers, tele for telemetry and the last will.',
    'Rules turn an event into an action on the device itself, with timers and Backlog for several steps.',
    'A rule on a sensor value reacts only when the sensor is reported, every 300 seconds unless TelePeriod is lowered.'
  ],
  pitfalls: [
    `Tasmota can be installed only by compiling it — Ready-made builds exist for each chip and can be flashed from the browser or with a flashing tool. Compiling is needed only for unusual feature sets.`,
    `A temperature rule switches the heater the moment the limit is crossed — Sensor values reach the rules only when they are reported, every 300 seconds by default. Lower TelePeriod if the control must be quicker.`,
    `Any Tasmota guide works for any device — The build, the chip and the flash size matter, and a plug that looks the same may carry a different chip. Check the chip before you open it.`
  ],
  terms: [
    { term: 'Tasmota', also: ['Tasmota firmware', 'Sonoff-Tasmota'], def: 'Open-source firmware for the ESP8266 and the ESP32 family, configured from a web page, a console and MQTT, with a small rule engine.' },
    { term: 'Template', also: ['device template', 'module'], def: 'A short JSON text that says which function each GPIO has on a particular product, so that a device of that model can be set up by pasting it into the web page.' },
    { term: 'cmnd, stat and tele', also: ['topic prefix', 'MQTT topic tree'], def: 'The three first levels of a Tasmota MQTT topic: cmnd carries commands to the device, stat its answers, tele its periodic telemetry and its last-will message.' },
    { term: 'Rule', also: ['Tasmota rule', 'Rule1'], def: 'A stored "on this event do that" instruction written as ON … DO … ENDON in the console, with timers and chained commands. There are three rule sets per device.' },
    { term: 'TelePeriod', also: ['teleperiod', 'telemetry period'], def: 'The interval, 300 seconds by default and at least 10, at which a Tasmota device reports its state and sensor values; rules on sensor values are evaluated at the same moments.' },
    { term: 'Berry', also: ['Berry script'], def: 'A small scripting language built into Tasmota on ESP32 chips, for logic that rules cannot express: drivers, automations and extra commands.' }
  ],
  choose: {
    good: ['Plugs, switches, relays and lamps that must answer MQTT commands', 'Devices bought with Tasmota or converted from a cloud product, with a template available', 'Systems already built around an MQTT broker'],
    avoid: ['Logic that needs real code, tight timing or many lines of rules', 'A battery sensor that must sleep for months: the firmware is built to stay online', 'Anyone who would rather describe the device in one file and keep it in version control (ESPHome fits better)'],
    check: ['The chip and flash size of your device, and the matching build', 'That the device you open is unplugged and that you know what is inside it', 'The telemetry period against how fast a sensor rule must react']
  },
  code: [
    {
      title: 'A relay with an auto-off timer, in Tasmota\'s own topics',
      about: 'Listens on cmnd/lamp/POWER for ON, OFF or TOGGLE, answers on stat/lamp/POWER, announces itself on tele/lamp/LWT and switches itself off after ten minutes. It is what the Tasmota rule above does, written by hand, so that you can see what the firmware gives you for free.',
      needs: 'An ESP32 DevKit and an MQTT broker. An LED stands in for the relay.',
      wiring: [['GPIO26', '220 Ω → LED → GND', 'the stand-in for a relay input']],
      libs: ['PubSubClient'],
      blocks: `
        when started
          set pin (26) as [output v]
          set [on v] to <false>
          set [on since v] to (0)
          connect to Wi-Fi [your-ssid] password [your-password]
          connect to MQTT broker [192.168.1.10]
          publish [Online] to topic [tele/lamp/LWT]
          subscribe to [cmnd/lamp/POWER]

        define switch relay (state)
          set [on v] to (state)
          set pin (26) to (on)
          set [on since v] to (milliseconds since start)
          if <on> then
            publish [ON] to topic [stat/lamp/POWER]
          else
            publish [OFF] to topic [stat/lamp/POWER]
          end

        when message arrives on [cmnd/lamp/POWER]
          if <(message) = [ON]> then
            switch relay <true> :: my
          else if <(message) = [OFF]> then
            switch relay <false> :: my
          else if <(message) = [TOGGLE]> then
            switch relay <not <on>> :: my
          end

        every (1) seconds
          if <<(on)> and <((milliseconds since start) - (on since)) ≥ (600000)>> then
            switch relay <false> :: my
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <PubSubClient.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const char *BROKER = "192.168.1.10";
        const int RELAY = 26;                          // an LED stands in for a relay input
        const uint32_t AUTO_OFF_MS = 10UL * 60 * 1000; // ten minutes, as in the rule

        NetworkClient net;
        PubSubClient mqtt(net);
        bool on = false;
        uint32_t onSince = 0;

        void switchRelay(bool state) {
          on = state;
          digitalWrite(RELAY, on);
          onSince = millis();
          mqtt.publish("stat/lamp/POWER", on ? "ON" : "OFF");    // the answer topic
        }

        void onMessage(char *topic, byte *payload, unsigned int length) {
          String cmd;
          for (unsigned i = 0; i < length; i++) cmd += (char)toupper(payload[i]);
          if (cmd == "ON") switchRelay(true);
          else if (cmd == "OFF") switchRelay(false);
          else if (cmd == "TOGGLE") switchRelay(!on);
        }

        void setup() {
          pinMode(RELAY, OUTPUT);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          mqtt.setServer(BROKER, 1883);
          mqtt.setCallback(onMessage);
        }

        void loop() {
          if (!mqtt.connected()) {
            // the will: the broker publishes "Offline" if this device vanishes
            if (mqtt.connect("lamp", NULL, NULL, "tele/lamp/LWT", 0, true, "Offline")) {
              mqtt.publish("tele/lamp/LWT", "Online", true);
              mqtt.subscribe("cmnd/lamp/POWER");
            } else { delay(2000); return; }
          }
          mqtt.loop();
          if (on && millis() - onSince >= AUTO_OFF_MS) switchRelay(false);   // the rule timer
        }
      `,
      py: String.raw`
        import network, time
        from machine import Pin
        from umqtt.simple import MQTTClient

        BROKER = "192.168.1.10"
        AUTO_OFF_MS = 10 * 60 * 1000                   # ten minutes, as in the rule
        relay = Pin(26, Pin.OUT)                       # an LED stands in for a relay input
        on = False
        on_since = 0

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        mqtt = MQTTClient("lamp", BROKER, keepalive=60)

        def switch_relay(state):
            global on, on_since
            on = state
            relay.value(on)
            on_since = time.ticks_ms()
            mqtt.publish(b"stat/lamp/POWER", b"ON" if on else b"OFF")   # the answer topic

        def on_message(topic, msg):
            cmd = msg.upper()
            if cmd == b"ON":
                switch_relay(True)
            elif cmd == b"OFF":
                switch_relay(False)
            elif cmd == b"TOGGLE":
                switch_relay(not on)

        mqtt.set_last_will(b"tele/lamp/LWT", b"Offline", retain=True)   # the will
        mqtt.set_callback(on_message)
        mqtt.connect()
        mqtt.publish(b"tele/lamp/LWT", b"Online", retain=True)
        mqtt.subscribe(b"cmnd/lamp/POWER")

        while True:
            mqtt.check_msg()
            if on and time.ticks_diff(time.ticks_ms(), on_since) >= AUTO_OFF_MS:
                switch_relay(False)                    # the rule timer
            time.sleep_ms(20)
      `,
      notes: ['This sketch does not reconnect when the broker goes away: Tasmota does, and so would a finished program ([[connection-manager-machine]]). With the pin driving a real relay module the warning above applies.', 'Tasmota\'s real topic is the one you set on the device (the default contains the chip\'s address). Here it is called lamp so the three versions line up.', 'Do not leave real credentials in shared code ([[credentials-handling]]).']
    }
  ],
  quiz: [
    { q: 'A Tasmota device has the topic "lamp". Which message switches its relay on?', choices: ['ON on stat/lamp/POWER', 'ON on cmnd/lamp/POWER', 'ON on tele/lamp/POWER', 'lamp on cmnd/ON'], a: 1, why: 'cmnd is the command tree. The device answers on stat/lamp/POWER and reports telemetry on tele/lamp/…, so publishing to those would do nothing.' },
    { q: 'Why does a rule that watches a temperature sensor react only about every five minutes on a default Tasmota setup?', choices: ['Rules run once an hour', 'The sensor value reaches the rules with each telemetry report, every 300 seconds by default', 'The relay is slow to switch', 'MQTT retains the old value'], a: 1, why: 'A sensor rule is evaluated when the sensor is reported, which is every telemetry period. Lowering TelePeriod (to as little as 10 seconds) makes it react sooner.' },
    { q: 'Tasmota can only be put on a device by compiling it from source.', a: false, why: 'Ready-made builds exist for each chip and can be flashed from a browser or with esptool. Compiling is needed only for an unusual set of features.' },
    { q: 'You want to flash Tasmota onto a mains smart plug. Which rule is not negotiable?', choices: ['Flash it while it is plugged in, so that it stays powered', 'Unplug it, open it, and power it only from the serial adapter\'s 3.3 V', 'Power it from the mains and use a 5 V adapter for the data lines', 'Short the relay terminals to bypass the case'], a: 1, why: 'The board of a mains plug has mains-voltage tracks on it. Work on it only when it is disconnected from the mains and powered by the adapter alone, and close the case properly afterwards.' }
  ],
  applications: [
    'Smart plugs and wall switches converted from a cloud service to local control.',
    'Energy-monitoring plugs reporting power through MQTT telemetry.',
    'Light switches that keep working from their own button when the network is down.',
    'Garden and shed controllers with timers kept in the device, using rules.'
  ],
  sources: [
    'Tasmota documentation: commands, rules, the MQTT topic structure and the supported-device lists (version 15.x).',
    'The Tasmota device templates repository and its community device database, for per-model GPIO assignments.',
    'The MQTT 3.1.1 specification, for the last-will and retain behaviour the topics rely on.'
  ],
  sim: 'rf-tasmota-rule'
},

/* ================================================================ wled */
{
  id: 'wled',
  parent: 'ready-made-firmware',
  title: 'WLED',
  level: 1,
  short: 'WLED makes an ESP a controller for addressable LEDs: over a hundred effects, palettes, segments, presets, a web page, a JSON interface and live streaming from a computer. It does one job, and does it so well that few people write their own.',
  keywords: ['WLED', 'effects', 'palettes', 'segments', 'presets', 'playlist', 'JSON API', 'DDP', 'E1.31', 'sACN', 'Art-Net', 'xLights', 'LedFx', 'usermod', 'audio reactive', 'maximum current', 'sync', 'WS2812B'],
  prereq: ['addressable-leds', 'wled-controllers', 'wifi-basics'],
  related: ['esphome', 'tasmota', 'home-assistant-integration', 'powering-led-strips', 'rest-apis-and-json', 'build-or-use', 'web-flashing'],
  body: `If you want light that moves — a flame along a shelf, a rainbow under cupboards, a chase on a staircase — the work is mostly not electronics. It is the effects: hundreds of small formulas for how a colour should travel along a strip, with speed and intensity to set. WLED is the firmware in which that work has already been done, for the ESP8266 and for the ESP32, S2, S3 and C3 families (the same list as on [[wled-controllers]]; version 16 was current at the time of writing).

### What you get

You flash it, join its Wi-Fi once, and tell it your strip: the pin, the chip type of the pixels (WS2812B and similar one-wire kinds, or two-wire types with a clock), and how many there are. From then on a web page and a phone app offer:

- **Effects**: more than a hundred, each with a speed and an intensity.
- **Palettes**: the set of colours an effect draws from.
- **Segments**: the strip cut into parts, each with its own effect, colours and brightness — one run of LEDs can be a sunrise along the top and a slow glow below.
- **Presets and playlists**: a stored look, and a list of looks that changes in time. Timers start them.
- **A brightness and a maximum-current setting** that lowers the light before the supply is overloaded.

### Control and streaming

WLED has a **JSON interface** (\`/json/state\` and its relatives) that anything can use: a button on another ESP, a script, Home Assistant, which has a ready integration and finds controllers by itself ([[home-assistant-integration]]). Several controllers can **sync** so that a whole room moves together. And WLED can stop making its own effects: a computer running lighting software can stream every pixel to it over the network, with **DDP**, **E1.31 (sACN)** or **Art-Net**. That is how music-reactive shows and sequenced holiday displays are driven.

~~~json
{"on": true, "bri": 120, "seg": [{"start": 0, "stop": 30, "fx": 2, "col": [[255, 120, 0]]}]}
~~~

That message, posted to a controller, sets half brightness, and colours pixels 0 to 29 orange with effect 2 (Breathe). *Stop* is the first pixel left out.

### Limits

WLED drives LEDs and little else. The frame rate is set by the pixels (30 µs each, so a thousand pixels give about 33 frames a second), and the memory of the chip sets how many it can hold; the ESP8266 runs out sooner. Sound-reactive effects need an I2S microphone and a chip with room for the extra code. Power and level shifting remain your job: see [[wled-controllers]] and [[powering-led-strips]].

> [!key] WLED is a finished pixel controller: effects, palettes, segments, presets, a JSON interface and live streaming from a computer. Use it for any strip you want to look good; write your own program only when the light must follow a signal or a rule that WLED cannot express.`,
  ideas: [
    'WLED already contains the hard part of lighting: more than a hundred effects and palettes with speed and intensity.',
    'Segments cut one strip into parts that each run their own effect.',
    'A JSON interface and Home Assistant integration let other devices set a look; DDP, E1.31 and Art-Net let a computer stream every pixel.',
    'The pixels set the limits: 30 µs each for the frame rate, and the chip\'s memory for the count.'
  ],
  pitfalls: [
    `WLED needs a special board — Any ESP of a supported family runs it. Special controller boards only add the level shifter, the fuse and the power terminals that a long strip needs.`,
    `More pixels only cost money — They also cost time (30 µs each, so a thousand pixels refresh about 33 times a second) and memory. A big installation is split over several outputs or several controllers.`,
    `Brightness 100 percent is the normal setting — A full-white pixel draws about 60 mA. Set the maximum current to what the supply and the wires can carry.`
  ],
  terms: [
    { term: 'Effect', also: ['FX', 'animation'], def: 'A rule for how colours move along a strip over time, such as a chase, a fade or a flame. In WLED each effect has a speed and an intensity setting and uses the colours of a palette.' },
    { term: 'Segment', also: ['LED segment'], def: 'A run of consecutive pixels with its own effect, colours and brightness, so that one strip behaves as several lights. A segment is given by its first pixel and the first pixel after it.' },
    { term: 'Preset', also: ['playlist', 'saved look'], def: 'A stored set of all the settings of a controller, recalled by number. A playlist steps through presets in turn, and timers can start either.' },
    { term: 'Palette', also: ['colour palette'], def: 'A set of colours that an effect blends between. Changing the palette changes the mood of an effect without changing how it moves.' },
    { term: 'Realtime streaming', also: ['DDP', 'E1.31', 'sACN', 'Art-Net'], def: 'Sending the colour of every pixel to the controller over the network from a computer, so that the controller shows it directly instead of running its own effects.' },
    { term: 'Usermod', also: ['user module'], def: 'An optional add-on to WLED\'s firmware, such as an audio-reactive module that reads a microphone. It is compiled in, so it needs a build that includes it.' }
  ],
  choose: {
    good: ['Any strip or matrix of addressable LEDs that should look good with little work', 'Installations that need presets, timers and syncing across controllers', 'Lighting driven by a computer (sequenced or music-reactive shows) through DDP, E1.31 or Art-Net'],
    avoid: ['Lighting that must show a sensor value or a machine state in a way WLED has no effect for: write a program', 'More pixels than one chip and one output can refresh at the speed you need', 'A device that must do something besides light: WLED does not run your logic'],
    check: ['The pixel type, the voltage (5, 12 or 24 V) and the data pin your strip needs', 'The supply and the maximum-current setting against the full-white current', 'That your chip is on the supported list, and the build includes the usermods you want']
  },
  code: [
    {
      title: 'A comet written by hand: what an effect does',
      about: 'A bright head runs along 30 pixels and leaves a fading tail, 25 times a second. That is all an effect is: a rule that gives every pixel a colour at every moment. WLED has hundreds of these, with a speed, an intensity and palettes on top.',
      needs: 'An ESP32 DevKit and a strip of 30 WS2812B pixels with a 5 V supply that shares ground with the board.',
      wiring: [['GPIO27', '330 Ω → strip DIN', 'through a level shifter on a long 5 V strip'], ['5 V and GND', 'the strip', 'with a capacitor across the supply; ground first']],
      libs: ['Adafruit NeoPixel'],
      blocks: `
        when started
          start pixel strip on pin (27) with (30) pixels :: light
          set [head v] to (0)
          set [last v] to (milliseconds since start)
        forever
          if <((milliseconds since start) - (last)) ≥ (40)> then
            change [last v] by (40)
            fade every pixel by (30) percent :: light
            set pixel (head) to colour (60) (18) (0)
            change [head v] by (1)
            if <(head) = (30)> then
              set [head v] to (0)
            end
            show pixels
          end
        end
      `,
      cpp: String.raw`
        #include <Adafruit_NeoPixel.h>

        #define LED_PIN   27
        #define LED_COUNT 30
        const int PEAK = 60;                  // the brightest level (0-255): keeps the current low
        const uint32_t STEP_MS = 40;          // the speed of the effect
        Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

        int level[LED_COUNT];                 // the brightness of each pixel
        int head = 0;
        uint32_t last = 0;

        void setup() {
          strip.begin();
        }

        void loop() {
          if (millis() - last >= STEP_MS) {
            last += STEP_MS;
            for (int i = 0; i < LED_COUNT; i++) level[i] = level[i] * 7 / 10;   // the tail fades
            level[head] = PEAK;                                                  // the head is bright
            head = (head + 1) % LED_COUNT;
            for (int i = 0; i < LED_COUNT; i++) strip.setPixelColor(i, strip.Color(level[i], level[i] * 3 / 10, 0));
            strip.show();                     // nothing is sent until show()
          }
        }
      `,
      py: String.raw`
        from machine import Pin
        from neopixel import NeoPixel
        import time

        LED_PIN = 27
        LED_COUNT = 30
        PEAK = 60                              # the brightest level (0-255): keeps the current low
        STEP_MS = 40                           # the speed of the effect
        strip = NeoPixel(Pin(LED_PIN), LED_COUNT)

        level = [0] * LED_COUNT                # the brightness of each pixel
        head = 0
        last = time.ticks_ms()

        while True:
            if time.ticks_diff(time.ticks_ms(), last) >= STEP_MS:
                last = time.ticks_add(last, STEP_MS)
                for i in range(LED_COUNT):
                    level[i] = level[i] * 7 // 10            # the tail fades
                level[head] = PEAK                           # the head is bright
                head = (head + 1) % LED_COUNT
                for i in range(LED_COUNT):
                    strip[i] = (level[i], level[i] * 3 // 10, 0)
                strip.write()                  # nothing is sent until write()
      `,
      notes: ['Change STEP_MS for speed and the 7 / 10 for the length of the tail: those two numbers are what WLED calls speed and intensity for this kind of effect.', 'Colours are kept low (60 of 255) so that 30 pixels draw well under an ampere. Full white would draw about 60 mA each ([[wled-controllers]]).', 'This version cannot be set from a phone, saved as a preset or synchronised with another strip. That is the work WLED has already done.']
    }
  ],
  examples: [
    {
      title: 'How big a supply, and how fast a frame?',
      q: 'A WLED strip has 200 pixels. The maximum-current setting is 4 A. What brightness does WLED reach with all pixels white, and how many frames a second can it send?',
      steps: ['At full white one pixel draws about 60 mA, so 200 pixels would draw $200 \\times 60\\ \\mathrm{mA} = 12$ A.', 'The limit is 4 A, so WLED lowers the brightness to about $4 / 12 = 1/3$ of the full level, around 85 of 255 (the idle current of the pixels is ignored).', 'One frame sends $200 \\times 24$ bits at 1.25 µs each, $200 \\times 30\\ \\mu\\mathrm{s} = 6$ ms, plus a short pause: a little under 160 frames a second.'],
      a: 'Brightness about a third of full (near 85 out of 255) and up to roughly 160 frames a second.'
    }
  ],
  quiz: [
    { q: 'What is the simplest way for a sketch on another ESP to change a WLED controller\'s brightness?', choices: ['Flash the controller again', 'Post a small JSON message with a "bri" value to the controller\'s state address', 'Send it a Bluetooth packet', 'Edit a YAML file on the controller'], a: 1, why: 'WLED listens on its network address for JSON state messages; "bri" sets the brightness. Nothing needs to be flashed.' },
    { q: 'In WLED, what is a segment?', choices: ['A part of the web page', 'A run of pixels with its own effect, colours and brightness', 'A pause between two frames', 'A kind of palette'], a: 1, why: 'A segment is a stretch of the strip given by its first pixel and the first pixel after it. Each segment can run a different effect, so one strip acts as several lights.' },
    { q: 'DDP, E1.31 and Art-Net let a computer decide the colour of every pixel, so the controller does not run its own effects.', a: true, why: 'These are network protocols for streaming pixel data. The controller shows what it receives, which is how sequenced and music-reactive shows are driven.' },
    { q: 'A long strip draws far more than the supply can give at full white. Which WLED setting protects the supply?', choices: ['The palette', 'The segment count', 'The maximum current', 'The preset timer'], a: 2, why: 'With a maximum current set, WLED lowers the brightness so that the estimated draw stays under the limit, instead of letting the supply overload.' }
  ],
  applications: [
    'Cabinet, stair and room lighting with effects and presets from a phone.',
    'Holiday and stage lighting sequenced from a computer over DDP, E1.31 or Art-Net.',
    'Sound-reactive lights with an I2S microphone and the audio usermod.',
    'Ambient light behind a screen, fed by software on the computer.'
  ],
  sources: [
    'WLED documentation: the web interface, segments, presets, the JSON API and the realtime protocols (version 16).',
    'The WS2812B datasheet, for the timing that limits the frame rate.',
    'The pages of the DDP, E1.31 (ANSI) and Art-Net protocols for the streaming formats.'
  ],
  sim: 'rf-wled-effects'
},

/* ================================================================ home-assistant-integration */
{
  id: 'home-assistant-integration',
  parent: 'ready-made-firmware',
  title: 'Home Assistant and its integrations',
  level: 2,
  short: 'Home Assistant keeps a list of entities and runs rules over them. ESPHome, Tasmota, WLED and your own code each reach it in a different way: a native API, MQTT discovery, a ready integration. What each way needs, and what to keep on the device.',
  keywords: ['Home Assistant', 'integration', 'entity', 'MQTT discovery', 'homeassistant/status', 'birth message', 'unique_id', 'availability', 'native API', 'zeroconf', 'mDNS', 'Mosquitto', 'broker', 'device_class', 'retain', 'automation'],
  prereq: ['esphome', 'tasmota', 'mqtt-topics-qos-retain', 'mdns'],
  related: ['wled', 'espeasy-and-openmqttgateway', 'voice-assistant-firmware', 'home-assistant-voice-hardware', 'zigbee-with-home-assistant', 'matter', 'local-first', 'dashboards', 'mqtt', 'device-identity-and-provisioning'],
  body: `Home Assistant sits in the middle of a smart home. It keeps a list of **entities** — a temperature, a switch, a light, a presence sensor — shows them on dashboards and runs automations over them. It runs on a small computer in the house and has a new release every month. What it cannot do is guess how a particular ESP talks. Each way in is an **integration**, and the firmware decides which one is used.

### Four ways in

| Firmware | How it reaches Home Assistant | How it is found |
|---|---|---|
| [[esphome|ESPHome]] | its native API: encrypted, direct, the device pushes changes | mDNS, then you enter the key |
| [[tasmota|Tasmota]] | MQTT through a broker, with discovery messages | the broker delivers them |
| [[wled|WLED]] | the WLED integration talks to the controller over the network | mDNS |
| your own code | MQTT with discovery messages, or a web hook | you announce it |

Matter and Zigbee devices have their own routes ([[matter]], [[zigbee-with-home-assistant]]). For everything that speaks MQTT one broker is the hub, and the topic names are the contract ([[mqtt-topics-qos-retain]]).

### MQTT discovery: a device introducing itself

Home Assistant listens under \`homeassistant/\`. A JSON message on \`homeassistant/sensor/shelf/light/config\` says "there is a sensor called Light level; its value arrives on this topic; its unit is %", and the entity appears at once. Its \`device\` part groups entities into one device. Four habits make it behave:

- **Retain** the discovery message, so the broker hands it over each time Home Assistant restarts.
- Give every entity a **unique_id**, or it cannot be renamed from the interface.
- Publish **availability** with a last will of "offline", so that a dead device shows as unavailable instead of frozen at its last value.
- Listen to Home Assistant's **birth message** on \`homeassistant/status\`: when it says "online", announce again. An empty message on the config topic deletes the entity.

### Where the rule should live

A rule can run in Home Assistant or on the device. Put in Home Assistant what is about the *home*: lights at sunset, a scene for the evening. Keep on the device what must work without the server or protects something: a heater's limit, a pump's dry-run cut-off, a button that switches its own light. Home Assistant is a computer that gets updated and restarted; a device should not depend on it for safety.

### Keeping it safe

The broker needs a user name and a password and should not be reachable from the Internet; the ESPHome key is a shared secret to be kept like a password ([[credentials-handling]]). For remote access prefer a VPN to an open port. A voice satellite adds a microphone to the house ([[voice-assistant-firmware]]).

> [!key] Each firmware reaches Home Assistant its own way: ESPHome through an encrypted native API, Tasmota and your own code through MQTT discovery, WLED through its integration. Retain the discovery message, publish availability, answer the birth message — and keep protective rules on the device.`,
  ideas: [
    'Home Assistant keeps entities and runs rules; an integration is the way one kind of device is connected to it.',
    'ESPHome and WLED are found by mDNS; Tasmota and your own code introduce themselves with MQTT discovery messages.',
    'A retained discovery message, an availability topic and a reply to the birth message make a device survive restarts of the server.',
    'Keep rules that protect something on the device, not in the server.'
  ],
  pitfalls: [
    `The sensor publishes to MQTT, so Home Assistant shows it — A bare value on a topic means nothing to it. It needs a discovery message (or a hand-written definition) that says what the topic is.`,
    `Discovery messages need no retain flag — Without retain they reach Home Assistant only if it is running at that moment. After a restart the entity is missing until the device announces itself again.`,
    `A last reading in the dashboard means the device is alive — Without an availability topic (or an expiry time) a dead device keeps showing its last value for ever.`
  ],
  terms: [
    { term: 'Entity', also: ['Home Assistant entity'], def: 'One thing Home Assistant tracks or controls, such as a temperature, a switch or a light. It has a name, a state and often a unit. Several entities make up a device.' },
    { term: 'Integration', also: ['Home Assistant integration'], def: 'The part of Home Assistant that knows how to talk to one kind of device or service and turns what it finds into entities.' },
    { term: 'MQTT discovery', also: ['discovery message', 'auto-discovery'], def: 'A convention in which a device publishes a retained JSON message under homeassistant/ describing its entities, so that Home Assistant creates them without manual setup.' },
    { term: 'Birth message', also: ['homeassistant/status'], def: 'The message "online" that Home Assistant publishes on homeassistant/status when it starts. Devices listen for it and announce themselves again.' },
    { term: 'unique_id', also: ['unique identifier'], def: 'A string that identifies one entity for good. With it Home Assistant can keep the entity\'s name, area and history; without it the entity is read-only in the interface.' }
  ],
  choose: {
    good: ['ESPHome\'s native API for devices that run ESPHome: no broker, encrypted, fast', 'MQTT discovery for Tasmota, ESPEasy, OpenMQTTGateway and your own sketches', 'The WLED integration for WLED controllers'],
    avoid: ['Bare MQTT values with no discovery message and no availability topic', 'Opening the broker or Home Assistant itself to the Internet with a port forward', 'Putting a safety limit only in a Home Assistant automation'],
    check: ['That the broker has a user and a password, and every device its own client id', 'That each entity has a unique_id and a sensible device_class and unit', 'What the device does when Home Assistant is off, and when the broker restarts']
  },
  code: [
    {
      title: 'A light sensor that announces itself to Home Assistant',
      about: 'Publishes a discovery message (retained), an availability message with a last will, and the light level every 10 seconds. When Home Assistant restarts and says "online", the device announces itself again. Home Assistant creates the sensor by itself; nothing is typed into its interface.',
      needs: 'An ESP32 DevKit, a light-dependent resistor in a voltage divider, an MQTT broker and the MQTT integration of Home Assistant.',
      wiring: [['GPIO32', 'LDR divider midpoint', 'an ADC1 pin: fine with Wi-Fi on'], ['3V3 and GND', 'divider ends', 'LDR to 3V3, 10 kΩ to GND']],
      libs: ['PubSubClient'],
      blocks: `
        when started
          set pin (32) as [input v]
          connect to Wi-Fi [your-ssid] password [your-password]
          connect to MQTT broker [192.168.1.10]
          subscribe to [homeassistant/status]
          announce to Home Assistant :: my

        define announce to Home Assistant
          publish [discovery message: name, unique id, state topic, unit] to topic [homeassistant/sensor/shelf/light/config] retained :: mqtt
          publish [online] to topic [home/shelf/availability] retained :: mqtt

        when message arrives on [homeassistant/status]
          if <(message) = [online]> then
            announce to Home Assistant :: my
          end

        every (10) seconds
          publish (map (analog read pin (32)) from (0) (4095) to (0) (100)) to topic [home/shelf/light]
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <PubSubClient.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const char *BROKER = "192.168.1.10";
        const int SENSOR = 32;                       // LDR divider on an ADC1 pin: fine with Wi-Fi on

        const char *CONFIG_TOPIC = "homeassistant/sensor/shelf/light/config";
        const char *STATE_TOPIC = "home/shelf/light";
        const char *AVAIL_TOPIC = "home/shelf/availability";
        const char *CONFIG = R"({"name":"Light level","unique_id":"shelf_light","state_topic":"home/shelf/light","availability_topic":"home/shelf/availability","unit_of_measurement":"%","state_class":"measurement","device":{"identifiers":["shelf"],"name":"Shelf sensor","manufacturer":"DIY","model":"ESP32 and LDR"}})";

        NetworkClient net;
        PubSubClient mqtt(net);
        uint32_t last = 0;

        void announce() {
          mqtt.publish(CONFIG_TOPIC, CONFIG, true);   // retained: found again after a restart
          mqtt.publish(AVAIL_TOPIC, "online", true);
        }

        void onMessage(char *topic, byte *payload, unsigned int length) {
          if (length == 6 && memcmp(payload, "online", 6) == 0) announce();   // Home Assistant has just started
        }

        void setup() {
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          mqtt.setServer(BROKER, 1883);
          mqtt.setBufferSize(512);                    // the default 256 bytes is too small for the config message
          mqtt.setCallback(onMessage);
        }

        void loop() {
          if (!mqtt.connected()) {
            // the will: the broker publishes "offline" if this device vanishes
            if (mqtt.connect("shelf", NULL, NULL, AVAIL_TOPIC, 0, true, "offline")) {
              mqtt.subscribe("homeassistant/status");
              announce();
            } else { delay(2000); return; }
          }
          mqtt.loop();
          if (millis() - last >= 10000) {
            last = millis();
            int percent = map(analogRead(SENSOR), 0, 4095, 0, 100);
            mqtt.publish(STATE_TOPIC, String(percent).c_str());
          }
        }
      `,
      py: String.raw`
        import network, time, json
        from machine import Pin, ADC
        from umqtt.simple import MQTTClient

        BROKER = "192.168.1.10"
        CONFIG_TOPIC = b"homeassistant/sensor/shelf/light/config"
        STATE_TOPIC = b"home/shelf/light"
        AVAIL_TOPIC = b"home/shelf/availability"
        CONFIG = {
            "name": "Light level", "unique_id": "shelf_light",
            "state_topic": "home/shelf/light", "availability_topic": "home/shelf/availability",
            "unit_of_measurement": "%", "state_class": "measurement",
            "device": {"identifiers": ["shelf"], "name": "Shelf sensor", "manufacturer": "DIY", "model": "ESP32 and LDR"},
        }
        sensor = ADC(Pin(32), atten=ADC.ATTN_11DB)   # LDR divider on an ADC1 pin: fine with Wi-Fi on

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        mqtt = MQTTClient("shelf", BROKER, keepalive=60)

        def announce():
            mqtt.publish(CONFIG_TOPIC, json.dumps(CONFIG).encode(), retain=True)   # retained: found again after a restart
            mqtt.publish(AVAIL_TOPIC, b"online", retain=True)

        def on_message(topic, msg):
            if msg == b"online":                     # Home Assistant has just started
                announce()

        mqtt.set_last_will(AVAIL_TOPIC, b"offline", retain=True)   # the will: "offline" if this device vanishes
        mqtt.set_callback(on_message)
        mqtt.connect()
        mqtt.subscribe(b"homeassistant/status")
        announce()

        last = time.ticks_ms()
        while True:
            mqtt.check_msg()
            if time.ticks_diff(time.ticks_ms(), last) >= 10000:
                last = time.ticks_ms()
                percent = sensor.read_u16() * 100 // 65535
                mqtt.publish(STATE_TOPIC, str(percent).encode())
            time.sleep_ms(50)
      `,
      notes: ['The discovery message is a single-entity message. Home Assistant also has a device-based form for many entities at once; look in its MQTT documentation for the version you run.', 'Like the other MQTT programs of this topic, this one does not reconnect when the broker restarts; a finished device would ([[connection-manager-machine]]).', 'Do not leave real credentials in shared code ([[credentials-handling]]).']
    }
  ],
  quiz: [
    { q: 'A sketch publishes its readings to home/shelf/light. Home Assistant shows no such sensor. What is the least that must be added?', choices: ['A second ESP as a bridge', 'A discovery message, or a manual definition, saying what the topic is', 'A cloud account', 'A faster Wi-Fi'], a: 1, why: 'A bare value on a topic carries no meaning. A discovery message tells Home Assistant that the topic is a sensor, with a name and a unit, and the entity is created.' },
    { q: 'Why is the discovery message published with the retain flag?', choices: ['To make it arrive faster', 'To keep it secret from other clients', 'So that the broker hands it to Home Assistant after each restart, without the device having to announce itself again', 'Because MQTT requires it'], a: 2, why: 'A retained message is stored by the broker and delivered to every new subscriber. Home Assistant subscribes when it starts and finds the config at once.' },
    { q: 'Publishing an empty message on an entity\'s config topic removes that entity from Home Assistant.', a: true, why: 'An empty retained payload on the discovery topic is the convention for deleting the entity (and clears the retained message from the broker).' },
    { q: 'A device sees "online" on homeassistant/status. What should it do?', choices: ['Restart itself', 'Publish its discovery messages again', 'Switch its relay off', 'Nothing: the message is for humans'], a: 1, why: 'The birth message means Home Assistant has just started and may have lost its entities. A device that announces again is found even if the config was not retained.' }
  ],
  applications: [
    'A mixed house: ESPHome sensors, a Tasmota plug and a WLED strip, all in one dashboard.',
    'A DIY sensor that appears in Home Assistant with a name, unit and device, from a sketch.',
    'Automations such as "lights on at sunset" that combine devices of different firmware.',
    'Dashboards on a wall tablet showing every entity of the house.'
  ],
  sources: [
    'Home Assistant documentation: the MQTT integration (discovery, availability, birth and will messages) and the ESPHome and WLED integrations.',
    'The MQTT 3.1.1 specification: retained messages and the last will.',
    'ESPHome documentation: the native API component and its encryption.'
  ],
  sim: 'rf-ha-link'
},

/* ================================================================ espeasy-and-openmqttgateway */
{
  id: 'espeasy-and-openmqttgateway',
  parent: 'ready-made-firmware',
  title: 'ESPEasy and OpenMQTTGateway',
  level: 2,
  short: 'Two more ready-made firmwares: ESPEasy, a sensor-and-switch firmware configured in a web page, and OpenMQTTGateway, which turns an ESP32 into a bridge between Bluetooth, 433 MHz radio and infrared on one side and MQTT on the other.',
  keywords: ['ESPEasy', 'OpenMQTTGateway', 'OMG', 'gateway', 'Theengs', 'BLE gateway', '433 MHz', 'RF', 'infrared', 'IR', 'LoRa', 'MQTT', 'devices', 'controllers', 'rules', 'plugins', 'sensor decoder'],
  prereq: ['tasmota', 'mqtt-topics-qos-retain', 'ble-advertising'],
  related: ['esphome', 'home-assistant-integration', 'sub-ghz-radios', 'infrared-links', 'ble-beacons', 'lora-boards', 'build-or-use', 'esp-now-gateway'],
  body: `Two further projects fill gaps the first three leave. **ESPEasy** is the older relative of Tasmota, built around sensors. **OpenMQTTGateway** is something else again: not a device but a listener, which takes what other devices say by radio and puts it on the network.

### ESPEasy: a sensor per task

ESPEasy is configured entirely in the device's web page. You add **devices** — in ESPEasy's words a task: a switch input, a DHT22, a pressure sensor, a relay — choosing each from a long list of plugins, and give each an interval and names for its values. One or more **controllers** say where the values go: an MQTT broker, Home Assistant through MQTT, or a web service. A small **rules** language, in the style of "on this event do that", handles local behaviour. It runs on the ESP8266 and on the ESP32 family. Because every plugin takes flash, builds come in sets of plugins, from a small normal build to a maximal one: choose the one that includes the sensors you use.

It overlaps with Tasmota. The practical difference is emphasis: Tasmota is strongest on switches, plugs and lamps, ESPEasy on a board with several sensors and an interval for each.

### OpenMQTTGateway: a bridge between radios and MQTT

Many cheap devices speak only to their own receiver: Bluetooth thermometers that broadcast every few seconds, 433 MHz door sensors and weather stations, infrared remotes. OpenMQTTGateway runs on an ESP32 and **publishes each of those messages as an MQTT message**, decoded where it knows the device, and sends commands the other way. Home Assistant picks them up by discovery ([[home-assistant-integration]]). One gateway in a central room can replace a drawer of receivers.

| Radio | In the ESP32 itself? | What you add |
|---|---|---|
| Bluetooth LE | yes (not the ESP32-S2, which has no Bluetooth) | nothing |
| 433 / 315 MHz | no | a receiver and a transmitter module |
| Infrared | no | an IR receiver module and an IR LED with a transistor |
| LoRa | no | a LoRa module or board ([[lora-boards]]) |

Setup is done in a web portal, and a web flasher installs it ([[web-flashing]]). The topics follow a pattern of a base, the gateway's name and the kind of message, and the exact names belong to the project's documentation for your version.

### Limits and honesty

A gateway is only as good as its radio. The cheapest 433 MHz receivers hear poorly and drown in noise; the transmitter power and duty cycle are limited by law in your country. Above all, **433 MHz and infrared carry no authentication**: a fixed code can be recorded and repeated by anyone nearby. Use them for lamps, blinds and weather, not for an alarm or a lock.

> [!key] ESPEasy is a web-configured sensor firmware like Tasmota but built around devices with intervals. OpenMQTTGateway is a bridge: Bluetooth, 433 MHz and infrared messages in, MQTT out. The radios that the ESP lacks must be added as modules, and unauthenticated radio is for convenience, not security.`,
  ideas: [
    'ESPEasy adds sensors and switches as devices in a web page, each with an interval, and sends the values to a controller such as an MQTT broker.',
    'OpenMQTTGateway listens to Bluetooth LE, 433 MHz and infrared devices and republishes what it hears as MQTT messages.',
    'Only Bluetooth LE is in the ESP32 itself; 433 MHz, infrared and LoRa need an extra module.',
    '433 MHz and infrared signals are not authenticated, so they suit lamps and weather stations, not alarms or locks.'
  ],
  pitfalls: [
    `A gateway can listen to any Bluetooth device — It can only decode what it knows, and many devices broadcast nothing at all until paired. The project lists the sensors it decodes.`,
    `Any 433 MHz module will do — The cheapest receivers are insensitive and noisy; a better-built receiver makes a large difference. The transmitter is limited by law in power and duty cycle.`,
    `A 433 MHz door sensor is a security device — Its code can be recorded and replayed or jammed. Treat such sensors as convenience, and use something authenticated for security.`
  ],
  terms: [
    { term: 'ESPEasy', also: ['ESP Easy'], def: 'Open-source firmware for the ESP8266 and the ESP32 family, configured in a web page by adding devices (sensors and switches), controllers (where the values go) and rules.' },
    { term: 'OpenMQTTGateway', also: ['OMG'], def: 'Open-source firmware that makes an ESP32 and a few radio modules into a gateway publishing Bluetooth, 433 MHz, infrared and LoRa messages on MQTT.' },
    { term: 'Controller (ESPEasy)', also: ['ESPEasy controller'], def: 'The destination of an ESPEasy device\'s values: an MQTT broker, a home-automation server or a web service. Each device is sent to one or more controllers.' },
    { term: 'ASK / OOK', also: ['amplitude-shift keying', 'on-off keying'], def: 'The simplest radio modulation, used by cheap 433 MHz devices: the carrier is switched on and off to send a pattern of pulses. It has no addressing or authentication.' },
    { term: 'Sensor decoder', also: ['BLE decoder', 'Theengs decoder'], def: 'A table of how a particular sensor encodes its readings in its Bluetooth broadcasts, so that a gateway can turn the raw bytes into temperature, humidity and battery level.' }
  ],
  choose: {
    good: ['ESPEasy for a board with several sensors, each with its own interval, reported to MQTT', 'OpenMQTTGateway to collect Bluetooth sensors, 433 MHz sensors and remotes in one place', 'A gateway near the centre of the house, wired to the router if you can'],
    avoid: ['433 MHz or infrared for an alarm or a lock', 'The cheapest radio modules when range matters', 'A gateway for devices that need pairing and a cloud, which it cannot talk to'],
    check: ['That your sensor is on the decoder list of the gateway version you install', 'The radio rules of your country for the 433 MHz transmitter', 'The build of ESPEasy: does it include the plugins you need?']
  },
  code: [
    {
      title: 'React to a decoded sensor message from a gateway',
      about: 'Subscribes to the topic where a gateway publishes a Bluetooth thermometer\'s readings as JSON, and lights an LED while the temperature is over 26 °C. The topic and the key names depend on your gateway; the shape of the job is the same.',
      needs: 'An ESP32 DevKit, an MQTT broker, and a gateway that publishes a sensor as JSON with a "tempc" value.',
      wiring: [['GPIO26', '220 Ω → LED → GND']],
      libs: ['PubSubClient', 'ArduinoJson'],
      blocks: `
        when started
          set pin (26) as [output v]
          connect to Wi-Fi [your-ssid] password [your-password]
          connect to MQTT broker [192.168.1.10]
          subscribe to [home/gateway/livingroom-sensor]

        when message arrives on [home/gateway/livingroom-sensor]
          set [t v] to (the number under the key [tempc] in the JSON message)
          if <(t) > (26)> then
            set pin (26) to [HIGH v]
          else
            set pin (26) to [LOW v]
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <PubSubClient.h>
        #include <ArduinoJson.h>

        const char *SSID = "your-ssid";
        const char *PASS = "your-password";
        const char *BROKER = "192.168.1.10";
        const char *TOPIC = "home/gateway/livingroom-sensor";   // whatever topic your gateway publishes to
        const int LED = 26;
        const float LIMIT_C = 26.0;

        NetworkClient net;
        PubSubClient mqtt(net);

        void onMessage(char *topic, byte *payload, unsigned int length) {
          JsonDocument doc;
          if (deserializeJson(doc, (const char *)payload, length)) return;   // not JSON: ignore it
          float t = doc["tempc"] | -100.0f;                                   // -100: the key was missing
          if (t > -100.0f) digitalWrite(LED, t > LIMIT_C);
        }

        void setup() {
          pinMode(LED, OUTPUT);
          WiFi.begin(SSID, PASS);
          while (WiFi.status() != WL_CONNECTED) delay(250);
          mqtt.setServer(BROKER, 1883);
          mqtt.setBufferSize(1024);                   // gateway messages can be long
          mqtt.setCallback(onMessage);
        }

        void loop() {
          if (!mqtt.connected()) {
            if (mqtt.connect("temp-led")) mqtt.subscribe(TOPIC);
            else { delay(2000); return; }
          }
          mqtt.loop();
        }
      `,
      py: String.raw`
        import network, time, json
        from machine import Pin
        from umqtt.simple import MQTTClient

        BROKER = "192.168.1.10"
        TOPIC = b"home/gateway/livingroom-sensor"      # whatever topic your gateway publishes to
        LIMIT_C = 26.0
        led = Pin(26, Pin.OUT)

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        def on_message(topic, msg):
            try:
                t = json.loads(msg).get("tempc")        # None if the key is missing
            except ValueError:
                return                                  # not JSON: ignore it
            if t is not None:
                led.value(t > LIMIT_C)

        mqtt = MQTTClient("temp-led", BROKER, keepalive=60)
        mqtt.set_callback(on_message)
        mqtt.connect()
        mqtt.subscribe(TOPIC)
        while True:
            mqtt.check_msg()
            time.sleep_ms(50)
      `,
      notes: ['A plain threshold makes the LED flicker around 26 °C; real control adds hysteresis ([[on-off-control-and-hysteresis]]).', 'Decoded Bluetooth messages usually carry more keys (humidity, battery, signal strength): read them the same way.', 'This sketch does not reconnect when the broker restarts; a finished one would.']
    }
  ],
  quiz: [
    { q: 'Which of these radios is already inside a standard ESP32, so that a gateway needs no extra module for it?', choices: ['433 MHz', 'Bluetooth LE', 'Infrared', 'LoRa'], a: 1, why: 'The ESP32 has Wi-Fi and Bluetooth. 433 MHz, infrared and LoRa all need an extra receiver or transmitter module.' },
    { q: 'A 433 MHz door sensor opens a lamp circuit. Why is it a poor choice for an alarm?', choices: ['It uses too much power', 'Its signal has no authentication, so it can be recorded and replayed or jammed', 'MQTT cannot carry it', '433 MHz does not pass through walls'], a: 1, why: 'Simple ASK/OOK devices send a fixed code. Anyone nearby can record and repeat it, or block it, so it is convenience, not security.' },
    { q: 'OpenMQTTGateway publishes every Bluetooth device it can hear, decoded, without any list of devices.', a: false, why: 'It decodes the sensors it has a decoder for. For others it can pass on only raw data, and devices that broadcast nothing until paired are out of reach.' },
    { q: 'How does ESPEasy decide when a sensor value is sent to its controller?', choices: ['Only when you press a button in the web page', 'Each device has its own interval, set in the web page', 'Once a day', 'Whenever the controller asks'], a: 1, why: 'Each ESPEasy device (task) has an interval and names for its values; at each interval it reads the sensor and sends the values to the controllers it is linked to.' }
  ],
  applications: [
    'A Bluetooth thermometer and hygrometer in every room, collected by one ESP32 gateway into Home Assistant.',
    'An old 433 MHz weather station and its sensors brought into a smart home.',
    'Infrared remotes of an air conditioner or a television triggered from automations.',
    'A multi-sensor board in a greenhouse, reporting with ESPEasy.'
  ],
  sources: [
    'ESPEasy documentation: devices, controllers, rules and the build types.',
    'OpenMQTTGateway documentation: supported gateways, hardware modules, MQTT topics and the web flasher.',
    'The radio regulations of your country for licence-exempt 433 MHz devices (ETSI EN 300 220 in Europe).'
  ],
  sim: 'rf-radio-gateway'
},

/* ================================================================ fluidnc-and-grbl */
{
  id: 'fluidnc-and-grbl',
  parent: 'ready-made-firmware',
  title: 'FluidNC: an ESP32 running a CNC machine',
  level: 2,
  short: 'FluidNC makes an ESP32 the controller of a router, laser or plotter: G-code goes in, smoothly accelerated step pulses come out. The machine is described in a YAML file, not in code. A look at the idea, the numbers and the care a machine needs.',
  keywords: ['FluidNC', 'Grbl', 'Grbl_ESP32', 'G-code', 'CNC', 'stepper', 'steps per mm', 'acceleration', 'homing', 'limit switch', 'planner', 'config.yaml', 'laser', 'spindle', 'step engine', 'RMT', 'I2S', 'status report', 'jog'],
  prereq: ['stepper-drivers', 'step-pulses-and-acceleration', 'limit-switches-and-homing', 'uart'],
  related: ['multi-axis-motion', 'the-rmt-peripheral', 'i2s', 'motor-power-and-protection', 'safety-in-control', 'build-or-use', 'esphome', 'web-server-on-esp'],
  body: `A CNC machine is a set of motors that must move a tool along a path at a chosen speed, starting and stopping smoothly so that nothing skips or shakes. The program for it is **G-code**: lines such as \`G1 X20 F600\`, "move in a straight line to X = 20 mm at 600 mm a minute". Turning those lines into step pulses with the right acceleration, on several axes at once, is a hard real-time job — and a solved one. **Grbl** was the open-source firmware that solved it on a small Arduino. **FluidNC** is its descendant for the ESP32.

### What FluidNC does

It reads G-code from a computer, an SD card or the web page, plans the motion a few moves ahead (so that it can slow into a corner and speed out of it), and generates the step and direction signals for the drivers. The pulses come from hardware, the RMT peripheral or a shift register on I2S, so Wi-Fi traffic does not disturb them. Spindles, lasers, coolant, probes and limit switches are handled too, and a web page shows the position and lets you jog and run files.

### The machine as a file

Nothing about your machine is compiled in. A YAML file in the flash describes it, which means a new machine is a text edit, in the same spirit as [[esphome]]. A fragment (option names and pin syntax can change between versions: check the project's pages):

~~~yaml
name: "Desktop router"
axes:
  x:
    steps_per_mm: 80
    max_rate_mm_per_min: 5000
    acceleration_mm_per_sec2: 100
    max_travel_mm: 300
    motor0:
      limit_neg_pin: gpio.32:low:pu
      stepstick:
        step_pin: gpio.26
        direction_pin: gpio.27
~~~

### The numbers

*Steps per millimetre* come from the motor, the microstepping and the mechanics: a motor of 200 steps a turn at 16 microsteps, on a belt that moves 40 mm a turn, needs 3200 / 40 = 80 steps per millimetre; on an 8 mm lead screw, 400. The step rate follows: at 3000 mm a minute (50 mm/s) and 80 steps per mm that is 4000 steps a second. The driver must keep up, and so must the motor: at high speed a stepper loses torque, which is why acceleration is a setting.

### Talking to it

The protocol is Grbl's. A sender writes a line and waits for \`ok\` (accepted into the planner buffer, not finished) or \`error:N\`; single characters work at once, whatever is queued: \`?\` asks for the status report, \`!\` holds, \`~\` resumes.

> [!warn] A machine can hurt you and itself. Fit a hardware emergency stop that cuts the motor and spindle power without the ESP32's help, keep hands out of the work area, use guards, and treat spindles and mains-powered drives with respect. A laser needs eye protection rated for its wavelength and an enclosure. FluidNC is not a safety system.

> [!key] FluidNC turns an ESP32 into a Grbl-compatible CNC controller whose machine is described in a YAML file. G-code goes in, planned and accelerated step pulses come out; the numbers to know are steps per millimetre and the step rate. The emergency stop belongs in hardware.`,
  ideas: [
    'G-code describes the path; the firmware plans it ahead and turns it into step and direction pulses with acceleration.',
    'FluidNC is the ESP32 successor of Grbl, speaks the same protocol, and is configured with a YAML file rather than compiled for each machine.',
    'Steps per millimetre follow from the motor, the microstepping and the travel per turn; the step rate follows from the feed rate.',
    'An "ok" from the controller means the line was accepted into its buffer, not that the motion is done.'
  ],
  pitfalls: [
    `A faster feed rate is only a number in the file — The step rate must be one the driver, the pulse engine and the motor can follow, and a stepper loses torque as it speeds up. Raise the rate and the acceleration in steps and test.`,
    `"ok" means the move has finished — It means the line was accepted into the planner buffer, which usually holds several moves. Poll the status report ('?') to know whether the machine is idle.`,
    `The firmware's feed hold is an emergency stop — It is a controlled pause. An emergency stop must cut the power to motors and spindle by hardware, whatever the software is doing.`
  ],
  terms: [
    { term: 'G-code', also: ['gcode', 'RS-274'], def: 'The line-based language that tells a CNC machine what to do: move to a point, at a feed rate, along a line or an arc, switch the spindle on. Each line is a command such as G1 X20 F600.' },
    { term: 'Grbl', also: ['grbl 1.1'], def: 'The open-source CNC controller firmware, first for the Arduino Uno, whose G-code interpreter, motion planner and serial protocol FluidNC follows.' },
    { term: 'FluidNC', also: ['Grbl_ESP32'], def: 'Open-source CNC controller firmware for the ESP32, compatible with Grbl, configured by a YAML file and operable from a web page, Wi-Fi, USB serial or an SD card.' },
    { term: 'Steps per millimetre', also: ['steps_per_mm'], def: 'How many step pulses move an axis by one millimetre: the motor\'s steps per turn times the microstepping, divided by the travel per turn.' },
    { term: 'Motion planner', also: ['look-ahead planner', 'junction deviation'], def: 'The part of the firmware that looks several moves ahead and decides the speed at each corner and the acceleration ramps, so that the machine does not stop at every line or exceed its limits.' },
    { term: 'Homing', also: ['home cycle'], def: 'Driving each axis against its limit switch to find a known position at start-up, from which all coordinates are measured.' }
  ],
  choose: {
    good: ['A router, laser engraver, plotter or small mill with stepper motors', 'A machine whose parts will change: the YAML file is easy to edit', 'People who want a web interface and Wi-Fi on the controller'],
    avoid: ['A machine with no hardware emergency stop', 'Applications needing tight closed-loop servo control with feedback: that is a different class of controller', 'Anything where a person is near moving parts and relies on the software to stop it'],
    check: ['Steps per millimetre, the maximum rate and the acceleration against your drivers and motors', 'The pin syntax and option names of the FluidNC version you flash', 'That the limit switches are wired so a broken wire is a stop, not a missed switch']
  },
  code: [
    {
      title: 'A tiny G-code sender: send a line, wait for ok',
      about: 'Sends seven lines of G-code to a Grbl-type controller on a second serial port, one at a time, and waits for each answer. It stops at the first error. It is the simplest possible sender; real ones keep several lines in flight by counting the characters the controller can buffer.',
      needs: 'Two ESP32 boards (one is the sender, one is the controller with FluidNC) or an ESP32 and a Grbl board, joined by three wires. Use 3.3 V logic.',
      wiring: [['GPIO18', 'controller TX', 'the sender\'s RX'], ['GPIO19', 'controller RX', 'the sender\'s TX'], ['GND', 'controller GND', 'a common ground']],
      blocks: `
        when started
          start serial at (115200) baud
          start UART (1) at (115200) baud
          wait (2) seconds
          for each [line v] in (the program lines: G21, G90, G0 X0 Y0, G1 X20 F600, G1 Y20, G1 X0, G1 Y0)
            write (line) to UART (1) :: bus
            set [reply v] to (wait for a reply line from UART (1) for (10) seconds) :: bus
            print (join (line) (join [ -> ] (reply)))
            if <not <(reply) = [ok]>> then
              stop [this script v]
            end
          end
      `,
      cpp: String.raw`
        const char *PROGRAM[] = { "G21", "G90", "G0 X0 Y0", "G1 X20 F600", "G1 Y20", "G1 X0", "G1 Y0" };
        const int LINES = sizeof(PROGRAM) / sizeof(PROGRAM[0]);

        String waitForReply() {
          uint32_t start = millis();
          while (millis() - start < 10000) {
            if (Serial1.available()) {
              String line = Serial1.readStringUntil('\n');
              line.trim();
              if (line == "ok" || line.startsWith("error")) return line;
            }
          }
          return "timeout";
        }

        void setup() {
          Serial.begin(115200);                          // the monitor
          Serial1.begin(115200, SERIAL_8N1, 18, 19);     // baud, config, RX pin, TX pin: to the controller
          delay(2000);                                   // let the controller finish starting
          while (Serial1.available()) Serial1.read();    // drop its start-up greeting
          for (int i = 0; i < LINES; i++) {
            Serial1.print(PROGRAM[i]);
            Serial1.print('\n');
            String reply = waitForReply();
            Serial.printf("%-14s -> %s\n", PROGRAM[i], reply.c_str());
            if (reply != "ok") break;                    // stop at the first error
          }
        }

        void loop() {}
      `,
      py: String.raw`
        from machine import UART
        import time

        PROGRAM = ["G21", "G90", "G0 X0 Y0", "G1 X20 F600", "G1 Y20", "G1 X0", "G1 Y0"]
        uart = UART(1, baudrate=115200, tx=19, rx=18, timeout=1000)   # to the controller

        def wait_for_reply():
            start = time.ticks_ms()
            while time.ticks_diff(time.ticks_ms(), start) < 10000:
                line = uart.readline()
                if line:
                    line = line.decode().strip()
                    if line == "ok" or line.startswith("error"):
                        return line
            return "timeout"

        time.sleep(2)                                    # let the controller finish starting
        uart.read()                                      # drop its start-up greeting
        for line in PROGRAM:
            uart.write(line + "\n")
            reply = wait_for_reply()
            print("%-14s -> %s" % (line, reply))
            if reply != "ok":                            # stop at the first error
                break
      `,
      output: `
        G21            -> ok
        G90            -> ok
        G0 X0 Y0       -> ok
        G1 X20 F600    -> ok
        G1 Y20         -> ok
        G1 X0          -> ok
        G1 Y0          -> ok
      `,
      notes: ['"ok" arrives when the line is in the controller\'s buffer, not when the tool has arrived; the program can finish while the machine is still moving. Send ? and read the status line (Idle or Run) to know.', 'Test with the tool removed or the machine unpowered first. A wrong G-code line on a real machine can crash the tool into the work.']
    }
  ],
  formulas: [
    {
      name: 'Steps per millimetre',
      expr: 's = spr*micro/lead',
      tex: 's = \\frac{n_{\\mathrm{rev}}\\, m}{\\ell}',
      vars: {
        s: { name: 'steps per millimetre', unit: 'steps/mm' },
        spr: { name: 'full steps per motor revolution', value: 200, int: true, tex: 'n_{\\mathrm{rev}}' },
        micro: { name: 'microsteps per full step', value: 16, int: true, tex: 'm' },
        lead: { name: 'travel per motor revolution', q: 'length', unit: 'mm', value: 40, tex: '\\ell' }
      },
      note: 'For a belt, the travel per revolution is the pulley\'s tooth count times the belt pitch (20 teeth of a 2 mm belt: 40 mm). For a lead screw it is the lead.',
      stories: { s: 'A motor of {spr} steps a turn runs at {micro} microsteps and moves the axis {lead} per turn. How many steps make one millimetre?' },
      practice: { unknowns: ['s', 'lead'] }
    },
    {
      name: 'Step rate for a feed rate',
      expr: 'f = F*s/60',
      tex: 'f = \\frac{F\\, s}{60}',
      vars: {
        f: { name: 'step rate', q: 'frequency', unit: 'Hz' },
        F: { name: 'feed rate', unit: 'mm/min', value: 3000 },
        s: { name: 'steps per millimetre', unit: 'steps/mm', value: 80 }
      },
      note: 'For a move along one axis. On a diagonal each axis steps more slowly, in proportion to its share of the move. The driver, the pulse engine and the motor must all be able to follow this rate.',
      stories: { f: 'An axis with {s} moves at a feed rate of {F}. How many step pulses a second must the controller send?' },
      practice: { unknowns: ['f', 'F'] }
    }
  ],
  examples: [
    {
      title: 'Will a belt axis keep up at 6000 mm a minute?',
      q: 'A belt axis uses a 20-tooth pulley and a 2 mm belt, a 200-step motor and 16 microsteps. The feed rate is 6000 mm/min. What step rate does the controller send?',
      steps: ['Travel per revolution: $20 \\times 2\\ \\mathrm{mm} = 40$ mm.', 'Steps per millimetre: $200 \\times 16 / 40 = 80$.', 'Feed rate in mm/s: $6000 / 60 = 100$ mm/s, so the step rate is $100 \\times 80 = 8000$ steps a second.'],
      a: '8000 steps a second (8 kHz): well within what a modern pulse engine and a stepper driver can produce, but a small motor may lose torque at this speed, so test it.'
    }
  ],
  quiz: [
    { q: 'An axis has 200-step motor, 16 microsteps and a lead screw that moves 8 mm per turn. How many steps make one millimetre?', choices: ['80', '200', '400', '3200'], a: 2, why: '200 × 16 = 3200 steps a turn, and a turn moves 8 mm, so 3200 / 8 = 400 steps per millimetre.' },
    { q: 'The controller answers "ok" to G1 X300 F600. Where is the tool?', choices: ['At X = 300', 'The move was accepted into the planner buffer; the tool may not have moved yet', 'The controller has stopped', 'It is homing'], a: 1, why: 'In Grbl\'s protocol "ok" means the line was accepted. The planner holds several moves and runs them afterwards; the status report says when the machine is idle.' },
    { q: 'FluidNC\'s feed hold is a safe replacement for a hardware emergency stop.', a: false, why: 'A hold is a controlled pause run by software. An emergency stop must remove power from the motors and spindle through hardware, even if the ESP32 has crashed.' },
    { q: 'Why does the planner look several moves ahead?', choices: ['To save memory', 'To decide the speed at each corner and the acceleration, instead of stopping at every line', 'To read the SD card faster', 'To keep Wi-Fi alive'], a: 1, why: 'With the next moves known, the machine can slow only as much as a corner needs and speed out of it, instead of stopping at the end of every segment.' }
  ],
  applications: [
    'Desktop routers and mills with stepper motors, driven from a web page and an SD card.',
    'Laser engravers running G-code with the laser power set by the spindle output.',
    'Pen plotters and drawing machines.',
    'Pick-and-place and dispensing machines with a few axes.'
  ],
  sources: [
    'The FluidNC documentation and wiki: configuration files, pin syntax, step engines and supported hardware.',
    'The Grbl 1.1 documentation: the G-code subset, the serial protocol (ok, error and real-time commands) and settings.',
    'The datasheet of your stepper driver (A4988, DRV8825, TMC2209): step pulse timing and microstepping.'
  ],
  sim: 'rf-cnc-machine'
},

/* ================================================================ voice-assistant-firmware */
{
  id: 'voice-assistant-firmware',
  parent: 'ready-made-firmware',
  title: 'Voice-assistant firmware',
  level: 2,
  short: 'A voice satellite hears the wake word, streams your sentence to a server and plays the reply. Its firmware is mostly timing and audio quality: a state machine with timeouts that must never hang. What runs on the ESP, what runs on the server, and what to tell the people in the house.',
  keywords: ['voice assistant', 'satellite', 'Assist', 'wake word', 'micro wake word', 'ESPHome', 'ESP-SR', 'Skainet', 'Willow', 'speech to text', 'text to speech', 'echo cancellation', 'pipeline', 'VAD', 'mute switch', 'ESP32-S3-BOX'],
  prereq: ['esphome', 'home-assistant-integration', 'home-assistant-voice-hardware', 'i2s-microphones'],
  related: ['wake-words-and-speech-commands', 'voice-assistants', 'esp32-s3-box', 'audio-player-firmware', 'state-machines', 'keyword-spotting', 'project-voice-lamp', 'using-psram'],
  body: `Saying "turn the lights off" to a room involves five jobs: hearing the right moment, recording the sentence, turning speech into text, working out what was meant, and answering aloud. A microcontroller is too small for the middle jobs, and a good design does not ask it to try. It does the first, the second and the last — and their quality decides whether the assistant feels good or maddening.

### The chain

1. **Wake word.** A small neural network on the device listens all the time for one phrase.
2. **Streaming.** After the phrase the device sends microphone audio to the server until the speaker stops.
3. **Understanding.** On the server, *speech-to-text* turns the audio into words, and an intent engine turns words into an action ("lights off, kitchen"). An assistant model can answer open questions.
4. **Reply.** *Text-to-speech* makes audio, which goes back to the device.
5. **Playing.** The device plays the answer through a speaker next to the microphone.

Home Assistant calls this chain an *Assist pipeline*. Each stage can run on your own server or in the cloud, and that decides who hears your speech.

### The firmware on the satellite

The Home Assistant Voice Preview Edition runs ESPHome ([[home-assistant-voice-hardware]]): its components read the microphone, run a wake word on the device, stream audio to Home Assistant over the native API and play the reply. The on-device wake word wants the memory of an ESP32-S3 with PSRAM. Espressif's own framework, ESP-SR with its audio front end and its wake-word and command-word engines, is the route when you build your own firmware ([[wake-words-and-speech-commands]]). Other open projects exist, such as Willow for the ESP32-S3-BOX ([[esp32-s3-box]]); check that one is still maintained before you build on it.

### A state machine with a clock

The satellite's behaviour is a small machine ([[state-machines|state machines]]): idle, streaming, waiting for the server, speaking, and a way back to idle from each. Its *timeouts* matter more than its states: how long to stream if nobody speaks, how long to wait for a server that has gone, and what then — an error sound, then listening again. A satellite that waits for ever for a dead server is broken. Try it in the simulation.

### What makes it good

**Echo cancellation**, so that the device can hear its wake word while it plays music; a wake word with few false accepts and misses; a fast server (the round trip is often a second or more); and a clear sign that it is listening.

> [!warn] A satellite is a microphone in a room. Tell everyone in the house, give it a hardware mute switch that really disconnects the microphone, and keep recordings off unless you chose to keep them. Consent and local law apply to recording anyone who is not you.

> [!key] A voice satellite hears the wake word, streams the sentence and plays the reply; a server does the understanding. Its firmware is timing and audio quality: a state machine whose timeouts always lead back to listening.`,
  ideas: [
    'The satellite does the hearing and the speaking; speech-to-text, understanding and text-to-speech run on a server.',
    'Running the wake word on the device means audio leaves only after the wake word.',
    'A satellite is a state machine; its timeouts, not its states, keep it from hanging when the server is gone.',
    'Echo cancellation and a hardware mute switch are what make a satellite usable and trustworthy.'
  ],
  pitfalls: [
    `The ESP understands the commands — It only hears the wake word and relays audio. Understanding is done by a server, which may be in your house or in a cloud service.`,
    `A software mute is as good as a switch — A mute that only the firmware honours can be undone by a bug or a hack. A switch that cuts the microphone's connection can be trusted by the people in the room.`,
    `Faster speech recognition is all that matters — The wake word, the echo cancellation and the way the device recovers from failures decide the experience at least as much.`
  ],
  terms: [
    { term: 'Assist pipeline', also: ['voice pipeline', 'Assist'], def: 'Home Assistant\'s name for the chain wake word, speech-to-text, intent recognition and text-to-speech. Each stage can be chosen to run locally or in the cloud.' },
    { term: 'Speech-to-text', also: ['STT', 'speech recognition', 'ASR'], def: 'Software that turns recorded speech into written words. On a home server it is a model running on the server\'s processor; it is the heaviest stage of the chain.' },
    { term: 'Text-to-speech', also: ['TTS', 'speech synthesis'], def: 'Software that turns a written reply into audio to be played by the device. It runs on the server, and the audio is sent back to the satellite.' },
    { term: 'Intent', also: ['intent recognition'], def: 'The action a sentence asks for, such as "turn off the kitchen lights", worked out from the words by matching sentence patterns or by an assistant model.' },
    { term: 'Voice activity detection', also: ['VAD', 'end-of-speech detection'], def: 'Detecting whether sound is speech, and so when the speaker has stopped, which tells the satellite to stop streaming and wait for the reply.' }
  ],
  choose: {
    good: ['A satellite on an ESP32-S3 with PSRAM and an audio processor, running ESPHome, for a Home Assistant house', 'Wake word on the device and understanding on a server in your own home', 'A hardware mute switch and a visible listening indicator'],
    avoid: ['A single bare microphone beside the speaker in a room where music plays', 'Streaming continuous audio to a cloud service without everyone knowing', 'A firmware that has no timeout for a server that does not answer'],
    check: ['Where each stage runs, and who can hear the audio at each', 'That the device returns to listening after every failure', 'The memory the wake word needs against the chip and its PSRAM']
  },
  quiz: [
    { q: 'In a well-designed satellite, where does the wake word run?', choices: ['On the server, so that the device stays simple', 'On the device, so that audio leaves it only after the wake word', 'In the cloud service of the speaker\'s maker', 'In the router'], a: 1, why: 'A small neural network on the device listens locally; only after it fires does the device open the stream to the server. Detecting it on the server would mean sending all sound all the time.' },
    { q: 'A satellite cannot hear its wake word while it plays music through its own speaker. Which part solves this?', choices: ['A faster server', 'A longer wake word', 'Echo cancellation, which subtracts what the device is playing from what the microphones hear', 'More flash memory'], a: 2, why: 'Echo cancellation removes the device\'s own output from the microphone signal, so that a person\'s voice can be heard over the music.' },
    { q: 'A hardware switch that disconnects the microphone is more trustworthy than a mute that only the firmware honours.', a: true, why: 'Software can be wrong or changed; a switch that opens the microphone\'s circuit works whatever the firmware does, and people can see its position.' },
    { q: 'The server is switched off when someone speaks to the satellite. What should the firmware do?', choices: ['Wait for ever for an answer', 'Time out, signal the error and go back to listening', 'Restart the chip', 'Send the audio to a cloud service instead'], a: 1, why: 'Every waiting state needs a timeout that leads back to a safe state. Sending the audio elsewhere would send speech to a service the owner did not choose.' }
  ],
  applications: [
    'Voice control of lights, blinds and heating in every room of a Home Assistant house.',
    'A kitchen timer and shopping-list device that listens for its wake word.',
    'A hands-free assistant in a workshop, where hands are busy.',
    'A voice lamp or a robot that takes a few spoken commands ([[project-voice-lamp]]).'
  ],
  sources: [
    'Home Assistant documentation: Assist, voice pipelines and the Voice Preview Edition.',
    'ESPHome documentation: the voice assistant, microphone, speaker and micro wake word components.',
    'Espressif, ESP-SR documentation: the audio front end, wake-word and command-word engines.'
  ],
  sim: 'rf-voice-states'
},

/* ================================================================ audio-player-firmware */
{
  id: 'audio-player-firmware',
  parent: 'ready-made-firmware',
  title: 'Audio player firmware',
  level: 2,
  short: 'A network player is a pipe with a bucket in the middle: bytes arrive, a decoder makes samples, an I2S stage feeds a DAC. The bucket — the buffer — decides how well it rides out Wi-Fi hiccups and what chip you need. Squeezelite-ESP32, ESPHome, ESP-ADF and the Arduino radio libraries compared.',
  keywords: ['Squeezelite-ESP32', 'Lyrion', 'Logitech Media Server', 'AirPlay', 'media player', 'ESP-ADF', 'internet radio', 'buffer', 'underrun', 'PSRAM', 'FLAC', 'MP3', 'bit rate', 'DAC', 'A2DP', 'Music Assistant', 'multi-room'],
  prereq: ['i2s-amplifiers-and-dacs', 'internet-radio', 'using-psram'],
  related: ['playing-audio-files', 'audio-codecs', 'bluetooth-audio', 'esphome', 'voice-assistant-firmware', 'psram-on-modules', 'i2s', 'digital-audio-basics'],
  body: `A network audio player is a pipe with a bucket in the middle. Bytes arrive from a server, a decoder turns MP3 or FLAC into samples, and an I2S stage hands the samples at a steady rate to a DAC and an amplifier ([[i2s-amplifiers-and-dacs]]). The bucket is the **buffer**, and nearly every trouble with such a player, and nearly every choice of hardware for it, is about that buffer.

### The ready-made players

- **Squeezelite-ESP32** makes an ESP32 a player of the Squeezebox family: it takes its music from a Logitech Media Server (continued today as Lyrion Music Server) and plays in step with other players, and builds can also accept AirPlay and Bluetooth streams. It is set up from a web page and suits boards with an I2S DAC; a chip with PSRAM is recommended for the larger codecs and buffers.
- **ESPHome's media player** components play a stream that Home Assistant hands them, and the replies of a voice assistant: the usual choice for a speaker that belongs to a smart home ([[esphome]]).
- **ESP-ADF**, Espressif's audio framework, is not a finished player but the parts of one in C: stream readers, MP3, AAC, FLAC and Opus decoders, I2S writers ([[audio-codecs]]).
- **Arduino libraries** for internet radio are the shortest road to a radio on a breadboard ([[internet-radio]]).

A *Bluetooth speaker* — receiving music from a phone — needs Bluetooth Classic, which among the microcontrollers only the original ESP32 has, so a C3, S3 or C6 cannot be one ([[bluetooth-audio]]).

### The arithmetic of the bucket

A stream arrives at its bit rate: 128 kbit/s MP3 is 16 kB a second, 320 kbit/s is 40 kB, FLAC is typically several hundred kbit/s, and uncompressed CD sound is 1411 kbit/s, 176 kB a second. A buffer lasts its size divided by that rate: 64 kB holds four seconds of 128 kbit/s MP3, and 2 MB of PSRAM about two minutes.

### Why the buffer matters

Wi-Fi is not steady. A busy channel, a microwave oven or a roaming access point can stop the data for a second or two. The buffer keeps the music playing through it; when it empties an **underrun** is heard as a gap. Internet radio is *live*: after a stall the server cannot send much faster than real time, so the buffer refills slowly, whereas a file from your own network refills in a blink. Try both in the simulation.

### What the chip needs

The decoder takes processor time and RAM, the Wi-Fi stack takes RAM, and little is left for a buffer. A chip with PSRAM — the catalogue lists it for the ESP32 (on WROVER modules), S2, S3, C5, C61 and P4 — can hold megabytes; a C3, C6 or H2 has none, and a small buffer must do.

> [!key] A network player is stream, decoder, buffer and I2S. The buffer (size divided by bit rate) is what rides out Wi-Fi stalls, so PSRAM matters for lossless and for live radio. Use a ready-made player for a standard job; keep Bluetooth speaker duty for the original ESP32.`,
  ideas: [
    'A player is stream, decoder, buffer, I2S, DAC; the buffer\'s size divided by the bit rate is how long it plays through a stall.',
    'Squeezelite-ESP32 and ESPHome\'s media player are ready-made; ESP-ADF and the Arduino libraries are parts to build with.',
    'Live radio refills slowly after a stall; a file on your own network refills at once.',
    'PSRAM allows buffers of megabytes; only the original ESP32 can be a Bluetooth speaker.'
  ],
  pitfalls: [
    `Any ESP32 board plays music well — Without PSRAM there is little room for a buffer once the decoder and Wi-Fi have their share, and audio is unforgiving of a stalled network.`,
    `A bigger buffer fixes everything — It helps against stalls, but adds delay at the start and uses memory the decoder needs. Past the length of your longest stall it adds nothing.`,
    `Bluetooth 5 means Bluetooth speaker — Phone-to-speaker streaming (A2DP) is Bluetooth Classic. The C3, S3 and C6 have Bluetooth LE only.`
  ],
  terms: [
    { term: 'Squeezelite-ESP32', also: ['Squeezelite'], def: 'Open-source firmware that turns an ESP32 with an I2S DAC into a network player of the Squeezebox family, controlled from a media server, with optional AirPlay and Bluetooth reception.' },
    { term: 'Underrun', also: ['buffer underrun', 'dropout'], def: 'The moment a playback buffer is empty and the decoder has no data to play. It is heard as a gap or a glitch in the sound.' },
    { term: 'Bit rate', also: ['bitrate', 'kbit/s'], def: 'The amount of data a compressed audio stream needs each second. 128 kbit/s MP3 is 16 kB a second; a buffer lasts its size divided by this rate.' },
    { term: 'Media player (Home Assistant)', also: ['media_player entity'], def: 'The Home Assistant entity of a device that plays audio. An ESPHome device with a speaker can appear as one and play streams and announcements sent to it.' }
  ],
  choose: {
    good: ['A multi-room or kitchen player on an ESP32 with an I2S DAC and PSRAM, using Squeezelite-ESP32', 'A speaker that is part of Home Assistant, using ESPHome\'s media player', 'A simple internet radio on a breadboard with an Arduino library'],
    avoid: ['A chip without PSRAM for lossless audio over a weak Wi-Fi link', 'The C3, S3 or C6 as a Bluetooth speaker', 'Driving a speaker straight from a GPIO or the DAC pin'],
    check: ['That the board has an I2S DAC or an amplifier, and PSRAM if the codecs are large', 'The longest Wi-Fi stall you expect against the length of the buffer', 'That the firmware build includes the codecs and services you want']
  },
  formulas: [
    {
      name: 'How long a buffer lasts',
      expr: 't = 8000*B/R',
      tex: 't = \\frac{8000\\, B}{R}',
      vars: {
        t: { name: 'playing time held by the buffer', q: 'time', unit: 's' },
        B: { name: 'buffer size', unit: 'kB', value: 64 },
        R: { name: 'bit rate of the stream', q: 'datarate', unit: 'kbit/s', value: 128 }
      },
      note: 'B is in kilobytes (1000 bytes); the bit rate is converted to bits per second inside the formula, which is why the factor is 8000. It ignores the part of the buffer used for other things.',
      stories: { t: 'A player has a buffer of {B} and plays a stream of {R}. How long can it play with no new data arriving?' },
      practice: { unknowns: ['t', 'B'] }
    }
  ],
  examples: [
    {
      title: 'Riding out a four-second stall',
      q: 'A radio stream of 192 kbit/s must survive a Wi-Fi stall of 4 s. How large must the buffer be, and does it fit in an ESP32 with no PSRAM?',
      steps: ['A stall of 4 s drains $192 \\times 4 / 8 = 96$ kB.', 'So a buffer of at least 96 kB, and in practice more, because the buffer is never quite full when the stall begins.', 'After a stall a live stream refills only a little faster than real time, so a second stall soon after finds the buffer part-empty.'],
      a: 'At least 96 kB, preferably 200 kB or more. That is a large share of the RAM of an ESP32 without PSRAM; with PSRAM it is trivial.'
    }
  ],
  quiz: [
    { q: 'How long does a 64 kB buffer last when the player decodes a 128 kbit/s MP3 stream and no new data arrives?', choices: ['About half a second', 'About four seconds', 'About forty seconds', 'About four minutes'], a: 1, why: '128 kbit/s is 16 kB a second; 64 kB / 16 kB/s = 4 s.' },
    { q: 'An internet radio stream stalls for 3 s and the player\'s buffer holds 2 s. What is heard?', choices: ['Nothing: buffers hide all stalls', 'About one second of silence once the buffer is empty', 'A faster tempo', 'The last two seconds repeating'], a: 1, why: 'The buffer plays for 2 s and then runs dry for the last second of the stall: an underrun, heard as a gap.' },
    { q: 'An ESP32-C3 can be built into a Bluetooth speaker that plays music from a phone.', a: false, why: 'Phone-to-speaker streaming uses Bluetooth Classic (A2DP). The C3 has Bluetooth LE only; among the microcontrollers only the original ESP32 has Classic.' },
    { q: 'Which hardware feature makes it practical to buffer minutes of lossless audio?', choices: ['A second UART', 'PSRAM', 'A touch sensor', 'A built-in DAC'], a: 1, why: 'A few hundred kilobytes of internal RAM hold seconds of lossless audio at most. PSRAM adds megabytes, which hold minutes.' }
  ],
  applications: [
    'A kitchen or bathroom radio built from an ESP32 and an I2S amplifier board.',
    'Multi-room music, with several ESP32 players in step with one media server.',
    'A speaker in a smart home that plays announcements and the replies of a voice assistant.',
    'Retrofitting an old radio or a cabinet with a network player.'
  ],
  sources: [
    'The Squeezelite-ESP32 project documentation: supported hardware, DAC configuration and the web interface.',
    'ESPHome documentation: the I2S audio, speaker and media player components.',
    'Espressif, ESP-ADF Programming Guide: audio elements, codecs and example pipelines.'
  ],
  sim: 'rf-stream-buffer'
},

/* ================================================================ web-flashing */
{
  id: 'web-flashing',
  parent: 'ready-made-firmware',
  title: 'Flashing from the browser',
  level: 1,
  short: 'A web page can install firmware on a board plugged into your computer: no tools, no drivers to learn. ESP Web Tools does it through the browser\'s Web Serial interface. How it works, what it needs, and why you should flash only what you trust.',
  keywords: ['ESP Web Tools', 'Web Serial', 'esp-web-install-button', 'manifest.json', 'chipFamily', 'web flasher', 'browser flashing', 'Chrome', 'Edge', 'HTTPS', 'Improv', 'factory image', 'esptool-js', 'offset'],
  prereq: ['flashing-and-esptool', 'boot-modes-and-download-mode', 'tasmota'],
  related: ['esphome', 'wled', 'espeasy-and-openmqttgateway', 'upload-problems', 'drivers-and-serial-ports', 'factory-programming', 'wifi-provisioning', 'ota-updates', 'secure-ota'],
  body: `Putting firmware on a board used to mean a toolchain, a serial driver, an address and a file name. Many projects now put one button on a web page instead: **Install**. Click it, choose your board's port from the browser's list, and a minute later the device is running the firmware. WLED, Tasmota, OpenMQTTGateway and ESPHome all offer it.

### How it works

Modern Chromium-based browsers (Chrome, Edge, Opera, Brave) have a **Web Serial** interface that lets a page open a serial port — but only after *you* pick the port in a dialogue; a page cannot choose one silently. **ESP Web Tools**, a component from the ESPHome team (version 10.4 at the time of writing), uses it: the page contains one element, and the library does the rest — it puts the chip into download mode, identifies it, picks the right build, writes it and resets the board. Firefox and Safari do not offer Web Serial at the time of writing, and the page must be served over **HTTPS** (a local test server is exempt).

~~~text
<esp-web-install-button manifest="manifest.json"></esp-web-install-button>
~~~

### The manifest

A small JSON file lists the builds, one per chip family, each a list of *parts* with the flash address of each. Most projects publish one **factory image** per chip — bootloader, partition table and program merged into a single file written at address 0 — so each build has one part.

~~~json
{
  "name": "Greenhouse sensor",
  "version": "1.2.0",
  "builds": [
    { "chipFamily": "ESP32",    "parts": [{ "path": "greenhouse-esp32.bin", "offset": 0 }] },
    { "chipFamily": "ESP32-C3", "parts": [{ "path": "greenhouse-c3.bin",    "offset": 0 }] }
  ]
}
~~~

Because the library reads the real chip, a user with an ESP32-S3 who opens this page is told there is no build for it, instead of flashing the wrong file. The same chain can then offer Wi-Fi set-up over the serial line ([[wifi-provisioning]]).

### When it does not work

- **The port list is empty.** A charge-only cable, a missing driver ([[drivers-and-serial-ports]]), or a board in use by another program such as a serial monitor.
- **It cannot connect.** Put the chip into download mode by hand: hold BOOT, tap RESET ([[boot-modes-and-download-mode]]). On boards with native USB the port changes when the chip restarts, so the page may need to ask again.
- **No build for the chip**, or the wrong browser, or a page served over plain HTTP.
- On Linux the user needs permission to use serial ports.

### Trust

Flashing hands the chip to whoever wrote the file. Install only from the project's own page, check the address, and remember that the firmware will later hold your Wi-Fi password. For a command-line alternative see [[flashing-and-esptool]]; for updates after the first install, over the air, see [[ota-updates]].

> [!key] ESP Web Tools flashes from a web page through Web Serial: a Chromium browser, an HTTPS page, a port you choose, and a manifest that lists one build per chip family. Flash only from sources you trust.`,
  ideas: [
    'A web page can write firmware through the browser\'s Web Serial interface, after you choose the port.',
    'ESP Web Tools is one HTML element plus a manifest that lists a build for each chip family.',
    'It needs a Chromium-based desktop browser and an HTTPS page; Firefox and Safari do not offer Web Serial.',
    'Flashing gives the file full control of the chip: install only from a source you trust.'
  ],
  pitfalls: [
    `Any browser can flash an ESP from a page — Only browsers with Web Serial, which at the time of writing means the Chromium family on a computer. Check the browser before blaming the cable.`,
    `If the Install button fails, the board is broken — The usual causes are a charge-only cable, no driver, another program holding the port, or a board that is not in download mode.`,
    `The page can flash whichever board it finds — The browser shows you a list and nothing happens until you choose a port. The library then checks the chip family against the manifest.`
  ],
  terms: [
    { term: 'Web Serial', also: ['Web Serial API'], def: 'A browser interface that lets a web page read and write a serial port, after the user has chosen the port in a dialogue. It exists in Chromium-based browsers on computers and needs HTTPS.' },
    { term: 'ESP Web Tools', also: ['esp-web-tools', 'esp-web-install-button'], def: 'A web component from the ESPHome project that installs firmware on an ESP from a web page, using Web Serial and a manifest of builds.' },
    { term: 'Manifest', also: ['manifest.json'], def: 'The JSON file of an ESP Web Tools page: the name and version of the firmware and, for each chip family, the parts to write and the flash address of each.' },
    { term: 'Factory image', also: ['merged binary', 'factory.bin'], def: 'One firmware file that contains the bootloader, the partition table and the program, laid out as they sit in flash, so that it can be written to a blank chip at address 0 in one step.' }
  ],
  choose: {
    good: ['Giving users of a project or a product a one-click first install', 'Teaching and workshops, where installing tools is a hurdle', 'A first install of ESPHome, WLED, Tasmota or OpenMQTTGateway'],
    avoid: ['Flashing from a page you do not trust', 'Production lines, which need scripted tools and logs ([[factory-programming]])', 'Browsers without Web Serial'],
    check: ['The browser: a Chromium-based one on a computer', 'That the page is served over HTTPS and its manifest lists your chip family', 'A data cable, a free port and a board that can enter download mode']
  },
  quiz: [
    { q: 'Which browser can flash an ESP32 from a web page at the time of writing?', choices: ['Firefox on a computer', 'Safari on a Mac', 'A Chromium-based browser on a computer', 'Any browser, through Wi-Fi'], a: 2, why: 'Web Serial exists in Chrome, Edge, Opera, Brave and other Chromium-based browsers on computers. Firefox and Safari do not offer it.' },
    { q: 'A web flasher is opened from a page served over plain HTTP on the Internet. What happens?', choices: ['It works, but slowly', 'The browser does not offer Web Serial to an insecure page', 'It flashes with a warning', 'It flashes a different chip'], a: 1, why: 'Web Serial is available only in a secure context: an HTTPS page, or a local address for testing.' },
    { q: 'A flashing web page can choose a serial port silently and start writing to it.', a: false, why: 'The browser shows a list of ports and the page can use only the one the user chooses.' },
    { q: 'In an ESP Web Tools manifest, what is chipFamily for?', choices: ['It names the maker of the board', 'It tells the library which build suits the chip it finds', 'It sets the baud rate', 'It encrypts the firmware'], a: 1, why: 'The library reads the chip\'s identity and installs the build whose chipFamily matches, so that firmware for another chip cannot be written by mistake.' }
  ],
  applications: [
    'The Install button on the pages of WLED, Tasmota, ESPHome and OpenMQTTGateway.',
    'A first-install page for your own product, hosted as a static HTTPS site.',
    'Workshops and classrooms where each learner flashes a board in a minute.',
    'Recovery: reinstalling a known good firmware on a board that no longer starts.'
  ],
  sources: [
    'The ESP Web Tools documentation: the install button, the manifest format and the supported chip families.',
    'The Web Serial API specification and the browser documentation of its availability.',
    'Espressif, esptool documentation: flash offsets and the boot modes the library drives.'
  ],
  sim: 'rf-web-flash'
},

/* ================================================================ build-or-use */
{
  id: 'build-or-use',
  parent: 'ready-made-firmware',
  title: 'Write your own, or use what exists?',
  level: 2,
  short: 'Ready-made firmware is a bargain for standard jobs and a trap for a product whose behaviour is its value. Four questions decide it, the middle road keeps most of the bargain, and writing your own has costs that are easy to forget.',
  keywords: ['build or buy', 'ready-made firmware', 'custom firmware', 'ESPHome lambda', 'external component', 'Berry', 'usermod', 'licence', 'GPL', 'EUPL', 'Cyber Resilience Act', 'maintenance', 'Marauder', 'security testing', 'decision'],
  prereq: ['esphome', 'tasmota', 'wled', 'choosing-a-framework'],
  related: ['fluidnc-and-grbl', 'home-assistant-integration', 'open-source-licences', 'regulations-cra-and-red', 'ota-partitions-and-rollback', 'reflashing-commercial-devices', 'from-idea-to-requirements', 'factory-programming'],
  body: `Ready-made firmware is a bargain: an evening's work gives a device that reconnects, updates itself, reports to a hub and has been tested by thousands of people. Writing your own is a commitment that lasts as long as the device. The question is which job you have.

### Four questions, in order

1. **Is there firmware for exactly this job?** Sensors and switches reporting to a smart home (ESPHome, Tasmota, ESPEasy), pixel lighting (WLED), a CNC controller (FluidNC), a radio gateway (OpenMQTTGateway), a network player (Squeezelite-ESP32), a voice satellite (ESPHome). If so, start there.
2. **Does configuration cover the behaviour?** If all you want is "this part on that pin, with these filters and rules", yes. If you need an algorithm of your own, or timing the firmware's loop does not promise, no.
3. **Do the constraints fit?** A coin cell for two years, a hard response time, a chip too small for the generic firmware, a part with no driver — ready-made firmware often meets such limits badly.
4. **Is it a product you will sell?** Then licences, security updates, certification and support are yours whichever firmware is inside.

The simulation walks the tree to one of three ends: use it as it is, add a little code, or write your own.

### The middle road

Each project has a hatch for your own code: ESPHome has lambdas and external components, Tasmota has Berry scripts on the ESP32, WLED has usermods. A device that is mostly standard is better served by one of these than by starting again.

### What writing your own really costs

The visible part is the logic. The rest is what ready-made firmware gives silently: reconnecting Wi-Fi and the broker, over-the-air updates that can roll back ([[ota-partitions-and-rollback]]), provisioning, a watchdog, logging, time, a settings store. For a product add vulnerability handling and security updates, which the EU's Cyber Resilience Act and the radio rules make a legal duty ([[regulations-cra-and-red]]).

### Licences and projects that stop

These projects are open source with conditions: Tasmota is under the GPL, WLED under the EUPL, ESPHome under a mix of permissive and GPL terms. A product that ships them must follow the licence ([[open-source-licences]]). A project can also stall: check its latest release.

### Firmware built for attack

Firmware for probing wireless networks also exists for the ESP32 — ESP32 Marauder is the best known, and the catalogue notes a few boards it runs on. It is made for security testing on your own equipment. Using it against networks or devices that are not yours, or without the owner's written permission, is illegal in most countries and can break the radio rules. It is named here only so that you recognise it, not taught.

> [!key] Use ready-made firmware for a standard job, add a little code through its hatch when you must, and write your own when the behaviour, the hardware or the product is yours. Count the invisible parts — updates, security, licence — before you decide.`,
  ideas: [
    'Four questions decide: is there firmware for this job, does configuration cover it, do the constraints fit, is it a product?',
    'The middle road — ESPHome lambdas and external components, Tasmota Berry scripts, WLED usermods — keeps most of the bargain.',
    'Writing your own also means writing everything ready-made firmware does silently: reconnecting, updates, provisioning, security.',
    'A product has duties whichever firmware it contains: licence conditions, vulnerability handling and security updates.'
  ],
  pitfalls: [
    `Ready-made firmware is only for beginners — Many commercial devices run ESPHome, Tasmota or similar firmware. The right test is whether the job is standard, not who is doing it.`,
    `Writing my own will be quicker than learning the tool — The first version may be. The reconnecting, updating and maintaining are what take the months.`,
    `Open source means no obligations — The licence has conditions, and a product sold with the firmware inside carries the duties of a maker, whatever the licence says about the code.`
  ],
  terms: [
    { term: 'Ready-made firmware', also: ['off-the-shelf firmware', 'turnkey firmware'], def: 'Firmware written and maintained by a project for a class of jobs, such as ESPHome, Tasmota or WLED, which you configure rather than program.' },
    { term: 'External component', also: ['custom component'], def: 'A driver or feature written in C++ and Python that is added to an ESPHome configuration from a folder or a repository, for a part ESPHome does not support itself.' },
    { term: 'Security-testing firmware', also: ['ESP32 Marauder'], def: 'Firmware made to probe wireless networks and devices, used legally only on equipment you own or have written permission to test.' }
  ],
  choose: {
    good: ['Standard devices: sensors, switches, lighting, gateways, players, CNC controllers', 'Prototypes, to learn what you need before committing to your own code', 'Home projects, where you are the only user and the maker'],
    avoid: ['A product whose behaviour is its value: a control algorithm, a protocol of your own', 'A battery device that must sleep for years, or a hard real-time job', 'Shipping a product on hobby firmware with no plan for updates and licences'],
    check: ['That a firmware exists for your chip and your parts, at the version you will use', 'How recently the project has released, and who maintains it', 'The licence, and what you must provide if you ship the firmware inside a product']
  },
  quiz: [
    { q: 'Which job is the strongest case for writing your own firmware?', choices: ['A temperature sensor that reports to Home Assistant', 'A strip of 100 pixels with effects', 'A device whose value is its own control algorithm, with tight timing, sold as a product', 'A smart plug with an energy meter'], a: 2, why: 'The first, second and fourth are standard jobs that ready-made firmware does well. A product whose behaviour is the algorithm and needs timing guarantees is where you must own the code.' },
    { q: 'A company ships a product with ESPHome inside. What must it still do?', choices: ['Nothing: the project takes the responsibility', 'Follow the licence, and handle vulnerabilities and security updates for what it sells', 'Rewrite the firmware in C', 'Pay the project'], a: 1, why: 'The maker of a product carries the duties of a maker, including security updates, whichever firmware is inside, and must follow the licence conditions.' },
    { q: 'Security-testing firmware such as ESP32 Marauder may be used on any wireless network within reach.', a: false, why: 'It may be used on equipment you own or have written permission to test. Using it on other people\'s networks is illegal in most countries and can break radio rules.' },
    { q: 'How can you add one custom calculation to an ESPHome device without writing a whole program?', choices: ['Flash another project over it', 'Write a lambda, or an external component for a whole driver', 'Edit Home Assistant\'s database', 'It cannot be done'], a: 1, why: 'A lambda is inline C++ inside the configuration; an external component adds a complete driver. Both keep the rest of the firmware ready-made.' }
  ],
  applications: [
    'Choosing the firmware for a home-automation sensor, plug or light strip.',
    'Deciding, at the start of a product, whether the first version is ready-made firmware or custom code.',
    'Reviewing a prototype that grew out of ESPHome or Tasmota for what a product would need.',
    'Judging a tutorial or a project by whether its firmware is maintained.'
  ],
  sources: [
    'The documentation of ESPHome, Tasmota and WLED: the extension points (lambdas, external components, Berry, usermods) and the licence files.',
    'Regulation (EU) 2024/2847, the Cyber Resilience Act: obligations of manufacturers of products with digital elements.',
    'The Radio Equipment Directive 2014/53/EU and your country\'s rules on wireless equipment.'
  ],
  sim: 'rf-build-or-use'
}
);
