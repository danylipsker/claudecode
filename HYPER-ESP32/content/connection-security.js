/* HYPER-ESP32 · content/connection-security.js
 *
 * Topic "connection-security" (Securing the connection): TLS on an ESP, certificates and root CAs, mutual TLS,
 * handling passwords and tokens, secure provisioning, a safe Wi-Fi network for devices, Bluetooth security in
 * practice, a safe web interface, the rules (EU CRA and RED, UK PSTI, US labels), vulnerabilities and updates,
 * and a checklist. Defensive only: how the owner of a device protects its connections and its users.
 * Simulations: sims/connection-security.js (ids cs-*).
 */
Hyper.add(
/* ================================================================ TLS on an ESP */
{
  id: 'tls-on-esp',
  parent: 'connection-security',
  title: 'TLS on an ESP',
  level: 2,
  short: `TLS wraps a connection in encryption and lets the device check who answers. On an ESP it costs memory, a second of radio time and, on a battery, real energy; it needs a trusted root and a correct clock, and it must fail closed when a check fails.`,
  keywords: ['TLS', 'mbedTLS', 'esp-tls', 'NetworkClientSecure', 'cipher suite', 'handshake', 'forward secrecy', 'SNI', 'TLS 1.2', 'TLS 1.3', 'port 8883', 'MQTT over TLS', 'setCACert', 'CA bundle', 'fail closed', 'AES-GCM', 'man in the middle'],
  prereq: ['https-and-tls', 'ntp-and-time', 'iot-threat-model'],
  related: ['certificates-and-root-cas', 'mutual-tls', 'mqtt', 'wifi-security', 'credentials-handling', 'ota-from-a-server', 'deep-sleep'],
  body: `[[wifi-security|Wi-Fi encryption]] protects the hop from the device to the router. **TLS** protects the whole way, from the device to the server, across the router, the provider and every network between. It gives three things: *confidentiality* (nobody on the path can read the data), *integrity* (nobody can change it unnoticed) and *authenticity of the server* (the data reaches the owner of the name you asked for). [[https-and-tls]] introduces the checks; this page is about doing them well on a chip with a few hundred kilobytes of RAM.

### One connection, step by step

1. **Hello.** The device lists the protocol versions and *cipher suites* it speaks, and names the server it wants (the *server name indication*, so that one address can host many names).
2. **Certificate.** The server picks a suite and sends its certificate chain.
3. **Checks.** The device verifies the signatures up to a root it already holds, the name, and the dates against its own clock ([[certificates-and-root-cas]]).
4. **Keys.** Both sides make fresh session keys with an ephemeral key exchange. The keys exist only for this connection, so a recording of the traffic stays unreadable even if the server's key is stolen later: *forward secrecy*.
5. **Data.** From here on every message is encrypted and authenticated, with a modern cipher such as AES-GCM or ChaCha20-Poly1305.

### What it costs on an ESP

| Cost | What to expect |
|---|---|
| RAM | A full TLS record is up to 16 KB, so buffers and certificates take tens of kilobytes at the moment of the handshake. "Out of memory" can look like a certificate error. |
| Time | About a second over Wi-Fi: a few round trips and public-key arithmetic. |
| Current | The radio stays on all that time. A sensor that wakes, sends one number and sleeps can spend more on the handshake than on the number. |
| Flash | A bundle of public roots takes tens of kilobytes; one stored root a few hundred bytes. |

The hardware helps unevenly: the catalogue lists AES, SHA and RSA accelerators on the ESP32, S2, S3, C3 and C6, and fewer blocks on the ESP32-C2 and C61, which do more in software, more slowly.

### What to trust, and what to do when it fails

Trust **one stored root** for one service, a **built-in bundle** for many, or **your own CA** for your own fleet. Never trust everyone, which is what \`setInsecure()\` and MicroPython's \`requests\` do. If any check fails, **fail closed**: send no password and no reading, do not fall back to plain HTTP, wait and retry. A fallback is exactly what an impostor asks for. Log *why* it failed: a wrong clock, an unknown root, a wrong name and no free memory need different cures.

> [!key] TLS protects the data from the device to the server and proves who the server is, provided the device checks the chain, the name and the dates. It costs memory, about a second of radio time and, per wake-up, a lot of battery, and when a check fails the device must stop rather than carry on without it.`,
  ideas: [
    `TLS protects the data all the way from the device to the server, which Wi-Fi encryption alone does not.`,
    `The device checks the chain of signatures, the name and the dates; skipping any one of them leaves room for an impostor.`,
    `A connection costs tens of kilobytes of RAM and about a second of radio time, and a handshake at every wake-up is expensive on a battery.`,
    `When a check fails the device stops and logs the reason; it never falls back to plain text.`
  ],
  pitfalls: [
    `The Wi-Fi is encrypted, so TLS is not needed — Wi-Fi encryption ends at the router. Beyond it the data crosses networks you do not control, and TLS is what protects it there.`,
    `Port 443 or 8883 means it is safe — The port only says that TLS is spoken. The safety comes from the certificate check; with setInsecure() the line is encrypted to whoever answers.`,
    `If TLS fails, retry without it so the device keeps working — A downgrade is what an impostor wants. Fail closed, log the reason and try again later with TLS.`
  ],
  terms: [
    { term: `Cipher suite`, also: [`cipher`, `AES-GCM`, `ChaCha20-Poly1305`], def: `The set of algorithms a TLS connection uses: how the keys are exchanged, how the server is authenticated and how the data is encrypted. Client and server each list what they support and agree on one.` },
    { term: `Forward secrecy`, also: [`PFS`, `perfect forward secrecy`, `ephemeral key exchange`], def: `A property of a TLS connection whose session keys are made fresh and thrown away afterwards. Traffic recorded today stays unreadable even if the server's long-term key is stolen later.` },
    { term: `Server name indication`, also: [`SNI`], def: `The name of the wanted server, sent in the first TLS message so that one address can serve certificates for many names. The device also uses that name to check the certificate.` },
    { term: `mbedTLS`, also: [`esp-tls`], def: `The TLS library inside ESP-IDF and the Arduino core. The HTTPS, MQTT and update clients are built on it, and its settings decide memory use and which versions and suites exist.` },
    { term: `Fail closed`, also: [`fail secure`], def: `To refuse to go on when a security check fails or cannot be made, instead of carrying on without it. A TLS client that fails closed sends nothing when the certificate is wrong.` },
    { term: `Certificate bundle`, also: [`CA bundle`, `built-in roots`], def: `A list of the root certificates of many public authorities, stored in flash so that a device can verify servers it has never seen. It takes tens of kilobytes and grows stale as authorities change.` }
  ],
  choose: {
    good: [`One stored root for a device that talks to one service`, `The built-in bundle for a device that talks to many public services`, `Your own CA's root for a fleet that talks only to your own servers`],
    avoid: [`setInsecure(), CERT_NONE or MicroPython's requests for anything that carries a secret`, `Falling back to plain HTTP when TLS fails`, `A new TLS connection for every reading when one long-lived connection would do`],
    check: [`The free heap at the moment of the handshake`, `What the device does when it has no valid clock`, `How much radio time one handshake really costs on your network, measured`]
  },
  code: [
    {
      title: `MQTT over TLS with the broker checked`,
      about: `Sets the clock, trusts one root, connects to a broker on port 8883 and publishes one message. If the certificate does not check out, nothing is sent.`,
      needs: `Any ESP32-family board with Wi-Fi and an MQTT broker that offers TLS on port 8883. Paste the PEM text of the root of the broker's chain (MicroPython: save it as root_ca.der on the board). Do not leave real credentials in shared code ([[credentials-handling]]).`,
      libs: [`PubSubClient`],
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          sync the clock with [pool.ntp.org] :: net
          trust the root certificate [root_ca] :: security
          connect to MQTT broker [broker.example.com] on port (8883) with TLS :: mqtt
          publish [online] to topic [home/esp32/status]
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <time.h>
        #include <NetworkClientSecure.h>
        #include <PubSubClient.h>

        const char ROOT_CA[] =
          "-----BEGIN CERTIFICATE-----\n"
          "paste the root certificate of your broker's chain here, one quoted line per row\n"
          "-----END CERTIFICATE-----\n";

        NetworkClientSecure net;
        PubSubClient mqtt(net);

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);

          configTime(0, 0, "pool.ntp.org");              // certificates have dates: the clock first
          struct tm t;
          if (!getLocalTime(&t, 10000)) {
            Serial.println("no time, so no TLS");
            return;
          }

          net.setCACert(ROOT_CA);                        // verify the broker against this root
          mqtt.setServer("broker.example.com", 8883);    // this name must be in the certificate
          if (mqtt.connect("esp32-demo")) {
            mqtt.publish("home/esp32/status", "online");
            Serial.println("connected over TLS");
          } else {
            Serial.printf("TLS or MQTT failed, state %d\n", mqtt.state());
          }
        }

        void loop() {
          mqtt.loop();
        }
      `,
      py: String.raw`
        import network, ntptime, ssl, time
        from umqtt.simple import MQTTClient

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        ntptime.settime()                                # certificates have dates: the clock first

        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ctx.verify_mode = ssl.CERT_REQUIRED              # verify the broker against this root
        ctx.load_verify_locations(cadata=open("root_ca.der", "rb").read())

        client = MQTTClient("esp32-demo", "broker.example.com", port=8883, ssl=ctx)
        try:
            client.connect()
            client.publish(b"home/esp32/status", b"online")
            print("connected over TLS")
            client.disconnect()
        except OSError as e:
            print("TLS or MQTT failed:", e)
      `,
      output: `
        connected over TLS
      `,
      notes: [`Store the root of the chain, not the broker's own certificate: that one is renewed every few months ([[certificates-and-root-cas]]).`, `In MicroPython only CERT_REQUIRED checks anything. Whether the name is checked as well depends on the library passing the server name to the context: test it by connecting to the broker's IP address instead of its name. A correct program must refuse.`, `PubSubClient has no TLS of its own: it rides on the secure client you give it.`]
    },
    {
      title: `HTTPS with the built-in bundle of roots`,
      about: `Trusts the list of public roots built into the Arduino core instead of one stored root, so that the same program can reach many public services.`,
      needs: `An ESP32-family board with Wi-Fi and Arduino core 3.3.12 or later (the call does not exist before).`,
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          sync the clock with [pool.ntp.org] :: net
          trust the built-in root certificates :: security
          set [answer v] to (https get [https://example.com/])
          print (status code)
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <time.h>
        #include <NetworkClientSecure.h>
        #include <HTTPClient.h>

        // the list of public root certificates that is built into the core
        extern const uint8_t ca_bundle_start[] asm("_binary_x509_crt_bundle_start");
        extern const uint8_t ca_bundle_end[] asm("_binary_x509_crt_bundle_end");
        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);

          configTime(0, 0, "pool.ntp.org");              // certificates have dates: the clock first
          struct tm t;
          if (!getLocalTime(&t, 10000)) {
            Serial.println("no time, so no HTTPS");
            return;
          }

          NetworkClientSecure client;
          client.setCACertBundle(ca_bundle_start, ca_bundle_end - ca_bundle_start);   // check the server against the built-in roots
          HTTPClient http;
          if (http.begin(client, "https://example.com/")) {
            int code = http.GET();
            Serial.println(code > 0 ? String(code) : http.errorToString(code));
            http.end();
          }
        }

        void loop() {}
      `,
      na: { py: `MicroPython has no built-in bundle: it trusts only the roots you load with load_verify_locations(). Put the roots of your services in a file and load that, as in the MQTT program above.` },
      output: `
        200
      `,
      notes: [`The bundle is a snapshot taken when the core was built. A new authority, or a root removed for misbehaviour, reaches the device only with a new firmware.`, `One stored root costs a few hundred bytes of flash, the bundle tens of kilobytes: for a device that talks to a single service, store the one root.`]
    }
  ],
  examples: [
    {
      title: `What does one handshake cost a battery sensor?`,
      q: `A sensor on an ESP32-C3 wakes once an hour. Sending the reading takes 0.3 s with the radio on; with a fresh TLS connection the handshake adds 1.2 s. Assume 100 mA on average while the radio is on, and the catalogue's 5 µA in deep sleep. How much more energy a day does TLS cost?`,
      steps: [`Without TLS: 0.3 s × 100 mA = 30 mA·s, which is 0.0083 mAh per wake-up; 24 wake-ups make 0.20 mAh a day.`, `With TLS: 1.5 s × 100 mA = 150 mA·s, which is 0.042 mAh per wake-up, or 1.0 mAh a day.`, `Deep sleep adds the same either way: 5 µA × 24 h = 0.12 mAh a day (the board around the chip usually adds far more: [[the-board-is-not-the-chip]]).`, `Totals: 0.32 mAh a day without TLS, 1.12 mAh a day with it. TLS multiplies the daily energy by about 3.5.`],
      a: `About 0.8 mAh a day more, 3.5 times the total. The remedies are to wake less often, to keep one connection open when the device is mains powered, or to send over ESP-NOW to a gateway that holds the TLS session. (The 100 mA and the 1.2 s are assumptions: measure your own.)`
    }
  ],
  quiz: [
    { q: `What does TLS give that WPA2 on the Wi-Fi link does not?`, choices: [`Encryption between the device and the router`, `Protection all the way to the server, and a check of who the server is`, `A faster connection`, `A stronger Wi-Fi password`], a: 1, why: `WPA2 protects the radio hop to the access point. TLS runs from the device to the server across every network between, and the certificate lets the device check who it is talking to.` },
    { q: `The server's long-term key is stolen next year. What does forward secrecy mean for traffic recorded today?`, choices: [`It can now be decrypted`, `It stays unreadable, because its session keys were made fresh and never stored`, `It is re-encrypted automatically`, `Nothing: forward secrecy concerns only future connections`], a: 1, why: `With an ephemeral key exchange the session keys exist only for that connection. The server's long-term key proves identity but does not protect the keys, so stealing it later does not open old recordings.` },
    { q: `The certificate check fails. Falling back to plain HTTP keeps the device working, so it is a sensible compromise.`, a: false, why: `The fallback sends the secret in the clear, which is the very thing the check was there to prevent, and an impostor can cause the failure on purpose. Fail closed, log the reason and retry later.` },
    { q: `A battery sensor wakes once an hour and sends one reading over a fresh TLS connection. Where does most of its energy go?`, choices: [`Deep sleep`, `The handshake and the radio time around it`, `Reading the sensor`, `Encrypting the few data bytes`], a: 1, why: `The handshake keeps the radio on for about a second more than a plain send, and the radio is by far the biggest consumer. The encryption of a few bytes is negligible.` }
  ],
  applications: [
    `MQTT to a cloud broker on port 8883, kept open for days ([[mqtt]]).`,
    `Posting readings to a web API over HTTPS ([[http-client]]).`,
    `Downloading firmware from your own server ([[ota-from-a-server]]).`,
    `Sending an alert to a chat or mail service ([[webhooks-and-notifications]]).`
  ],
  sources: [
    `IETF RFC 8446, *The Transport Layer Security (TLS) Protocol Version 1.3*, and RFC 5246, version 1.2.`,
    `Arduino core for ESP32 documentation, the *NetworkClientSecure* library and its examples (core 3.3).`,
    `Espressif, *ESP-IDF Programming Guide*, the "ESP-TLS" and "mbedTLS" pages (5.5 and 6.x).`
  ],
  sim: ['cs-tls-handshake', 'cs-mitm']
},

/* ================================================================ certificates and root CAs */
{
  id: 'certificates-and-root-cas',
  parent: 'connection-security',
  title: 'Certificates and root CAs',
  level: 2,
  short: `A certificate ties a name to a key and is signed by someone the device trusts. How a chain runs from a short-lived leaf to a long-lived root, what a device should store, why pinning a leaf breaks, and what to do when a root expires.`,
  keywords: ['certificate', 'X.509', 'chain', 'leaf', 'intermediate', 'root CA', 'trust store', 'pinning', 'PEM', 'DER', 'notAfter', 'expiry', 'subject alternative name', 'private CA', 'revocation', 'Let\'s Encrypt', 'root expired'],
  prereq: ['tls-on-esp', 'ntp-and-time'],
  related: ['mutual-tls', 'https-and-tls', 'ota-from-a-server', 'secure-ota', 'vulnerabilities-and-updates', 'wifi-security'],
  body: `A **certificate** is a signed statement: "this public key belongs to *broker.example.com*, from this date to that date." The signature is made by an **issuer**, whose own certificate is signed by another, up to a **root** that signs itself. A device cannot verify a root by any other means: it simply *holds* it, put there with the firmware. The set of roots it holds is its **trust store**.

### The chain

| Link | What it is | Lasts | Where it lives |
|---|---|---|---|
| **Leaf** | the server's own certificate: its name and key | weeks to about a year, and getting shorter | on the server, renewed automatically |
| **Intermediate** | the authority's working certificate, which signs leaves | a few years | sent by the server along with the leaf |
| **Root** | the authority's anchor, its key kept offline | fifteen to twenty-five years | in the device's trust store |

The device checks every link: each signature, that each issuer may sign certificates at all, each date against the device's clock, and that the **name** it asked for is among the names in the leaf. So connecting by IP address fails the name check, and a device with no valid clock fails every date check. Whether a certificate was *revoked* needs lists or live queries that small devices rarely run; short lifetimes do that job instead.

### What to store

| Store this | Survives a leaf renewal | Survives a new intermediate | The catch |
|---|---|---|---|
| The leaf (pinning) | no | no | breaks every few months |
| The intermediate | yes | no | the authority may retire it |
| The root | yes | yes | it expires one day, and the authority may move to a new root |
| A built-in bundle | yes | yes | tens of kilobytes; the list ages |
| Your own CA's root | yes | yes | you run the CA |

### Roots expire too

In September 2021 a widely used root expired, and devices that did not hold its successor stopped connecting while browsers carried on. A device outlives a root, so plan the way to replace one ([[ota-from-a-server]]), and have the device count the days: the program below does.

> [!key] Store the root of the chain, never the leaf, so that renewals do not break the device; give the device a clock, a name to connect by and a way to receive a new root before the old one expires. Your own CA suits a fleet that talks only to your own servers.`,
  ideas: [
    `A certificate is a signed statement binding a name to a public key; trust comes from a chain of signatures to a root the device holds.`,
    `The leaf is renewed every few months, the intermediate every few years and the root only after many years, so store the root, not the leaf.`,
    `The device checks the signatures, the permission to sign, the dates by its own clock and the name it connected to.`,
    `Roots expire too: a device meant to last years needs a way to receive a new trust store.`
  ],
  pitfalls: [
    `Pinning the server's certificate is the most secure choice — It is the most brittle: the leaf is renewed every few months and the device stops working at the first renewal. Pin the root or your own CA, and plan the update.`,
    `Roots last for ever — They have end dates, typically fifteen to twenty-five years from the day they were made, and a device built today may outlive one.`,
    `A name error means the certificate is bad — Often the certificate is fine and the program connected to an IP address or to a different name from the one in it.`
  ],
  terms: [
    { term: `Certificate chain`, also: [`chain of trust`, `certification path`], def: `The sequence of certificates from a server's leaf, through intermediates, to a root: each signed by the next. The device trusts the leaf only if the chain ends at a root in its trust store.` },
    { term: `Intermediate certificate`, also: [`intermediate CA`, `issuing CA`], def: `The working certificate of an authority, signed by its root, which in turn signs the leaves. The server sends it with its own certificate so that the device can complete the chain.` },
    { term: `Trust store`, also: [`root store`, `CA store`], def: `The set of root certificates a device holds and trusts. Whatever a root signs, directly or through intermediates, is trusted.` },
    { term: `Certificate pinning`, also: [`pinning`, `pinned certificate`], def: `Accepting only one specific certificate or key instead of anything a trusted authority signed. Pinning the short-lived leaf breaks at every renewal; pinning a root or your own CA does not.` },
    { term: `Subject alternative name`, also: [`SAN`, `common name`, `CN`], def: `The list of names inside a certificate for which it is valid. The device compares the name it connected to with this list.` },
    { term: `Private CA`, also: [`own CA`, `internal CA`], def: `A certificate authority you run yourself, whose root only your devices and servers trust. It suits fleets and mutual TLS, at the price of running it safely.` }
  ],
  choose: {
    good: [`The root of the server's chain, for one service`, `Your own CA's root, for a fleet that talks to your own server`, `A bundle for a device that must reach many public services`],
    avoid: [`Pinning the leaf certificate`, `A root stored once, with no way to change it in ten years`, `Connecting by IP address to a server that has a name`],
    check: [`The "Not After" date of every certificate you store`, `That the server sends its intermediates as well as its leaf`, `What the device does when it has no valid clock`]
  },
  code: [
    {
      title: `Warn before the stored root expires`,
      about: `Counts the days until the end date of the root certificate stored in the firmware and complains a year ahead, so that the update can be planned while the device still works.`,
      needs: `Any ESP32-family board with Wi-Fi. Read the "Not After" date of your own root on a computer with: openssl x509 -enddate -noout -in root_ca.pem, and put it in the program.`,
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          sync the clock with [pool.ntp.org] :: net
          set [days v] to (days from today until [2035-06-04] :: time)
          print (join [the stored root expires in ] (days))
          if <(days) < (365)> then
            print [WARNING: plan the update now]
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <time.h>

        // The "Not After" date of the root certificate stored in this firmware (an example date).
        const int EXP_YEAR = 2035, EXP_MONTH = 6, EXP_DAY = 4;
        const int WARN_DAYS = 365;                      // start complaining a year ahead

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);

          configTime(0, 0, "pool.ntp.org");             // UTC, so mktime() below gives UTC too
          struct tm now;
          if (!getLocalTime(&now, 10000)) {
            Serial.println("no time yet");
            return;
          }
          struct tm end = {};
          end.tm_year = EXP_YEAR - 1900;
          end.tm_mon = EXP_MONTH - 1;
          end.tm_mday = EXP_DAY;
          long days = (long)((mktime(&end) - mktime(&now)) / 86400);
          Serial.printf("the stored root expires in %ld days\n", days);
          if (days < WARN_DAYS) Serial.println("WARNING: plan the update now");
        }

        void loop() {}
      `,
      py: String.raw`
        import network, ntptime, time

        EXP = (2035, 6, 4)                       # the "Not After" date of the stored root (an example date)
        WARN_DAYS = 365                          # start complaining a year ahead

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        ntptime.settime()                        # sets the clock to UTC

        # On the ESP32 time.time() counts from the year 2000: compare it with a date made by the same clock
        end = time.mktime((EXP[0], EXP[1], EXP[2], 0, 0, 0, 0, 0))
        days = (end - time.time()) // 86400
        print("the stored root expires in", days, "days")
        if days < WARN_DAYS:
            print("WARNING: plan the update now")
      `,
      output: `
        the stored root expires in 3165 days
      `,
      notes: [`The figure shown is for 4 October 2026. A real product would send the warning to its own server, not only to the serial port.`, `A leaf certificate never needs this: the server renews it. Only what you store in the device has to be watched.`, `MicroPython's clock starts in 2000, not 1970, so do not compare time.time() with a Unix timestamp you looked up elsewhere.`]
    }
  ],
  examples: [
    {
      title: `Will the stored root outlive the product?`,
      q: `A device ships in October 2026 with a root that expires in June 2035. The product is meant to run for twelve years. When does it stop connecting, and what has to happen before then?`,
      steps: [`Twelve years from October 2026 is October 2038, but the root ends in June 2035: about 8 years and 8 months after shipping.`, `After that date every server whose chain ends at this root fails the date check on the device, however healthy the server is.`, `So a new trust store (or the whole firmware) must reach every device before June 2035, over the air ([[ota-from-a-server]]), and the device must be able to verify that update without the root that is about to expire ([[secure-ota]]).`],
      a: `It stops in June 2035, three and a half years before the end of its planned life. Either ship an update path and use it in good time, or accept a shorter life and say so.`
    }
  ],
  quiz: [
    { q: `You store the server's own certificate in the firmware to be extra safe. What happens when the server renews it?`, choices: [`Nothing: renewals keep the same key and certificate`, `The device no longer recognises the server and stops connecting`, `The device downloads the new one by itself`, `The device falls back to plain HTTP`], a: 1, why: `A renewal issues a new certificate. The stored copy no longer matches, so every connection is refused until the device is reflashed. Store the root of the chain instead.` },
    { q: `A device is meant to talk to one cloud service for ten years. What is the best thing to store, and what else does it need?`, choices: [`The leaf, and nothing else`, `The root, and a way to replace it before it expires`, `No certificate, with setInsecure()`, `The service's password`], a: 1, why: `The root survives leaf and intermediate renewals. It still has an end date, so the device needs an update path and a warning, as in the program above.` },
    { q: `Connecting to https://192.168.1.20/ will pass the name check when the certificate was issued for broker.example.com.`, a: false, why: `The name check compares the name you connect to with the names in the certificate. An IP address is not in that list. Connect by name, or give the certificate an entry for the address.` },
    { q: `A root expires in 2035 and the device was built in 2026. What matters?`, choices: [`Nothing: roots never expire`, `The device must get a new trust store or firmware before 2035, or it stops connecting`, `The server must renew its leaf every year`, `Only the clock`], a: 1, why: `After 2035 the root fails the date check, and so does everything it signed. The update must arrive in good time and be verifiable.` }
  ],
  applications: [
    `Any HTTPS or MQTT client that has to keep working for years in the field.`,
    `A fleet with its own private CA, whose root is the only thing the devices trust ([[mutual-tls]]).`,
    `Reading a failed connection: "unknown CA", "expired" and "name mismatch" each point at a different link of the chain ([[https-and-tls]]).`,
    `Planning the update of trust stores as part of a product's support period ([[vulnerabilities-and-updates]]).`
  ],
  sources: [
    `IETF RFC 5280, *Internet X.509 Public Key Infrastructure Certificate and Certificate Revocation List (CRL) Profile*.`,
    `Espressif, *ESP-IDF Programming Guide*, the "ESP x509 Certificate Bundle" page (5.5 and 6.x).`,
    `Arduino core for ESP32 documentation, the *NetworkClientSecure* library (core 3.3).`
  ],
  sim: ['cs-cert-expiry', { id: 'cs-tls-handshake', params: { focus: 'chain' } }]
}
,

/* ================================================================ mutual TLS and device certificates */
{
  id: 'mutual-tls',
  parent: 'connection-security',
  title: 'Mutual TLS and device certificates',
  level: 3,
  short: `In ordinary TLS only the server proves who it is. With mutual TLS the device also presents a certificate and proves it holds the private key, so the server knows which device is calling, with no shared password. What it takes on an ESP, and where the key must live.`,
  keywords: ['mutual TLS', 'mTLS', 'client certificate', 'device certificate', 'private key', 'CSR', 'AWS IoT', 'X.509', 'setCertificate', 'setPrivateKey', 'Digital Signature peripheral', 'secure element', 'device identity', 'client authentication', 'revoke'],
  prereq: ['certificates-and-root-cas', 'tls-on-esp', 'mqtt'],
  related: ['credentials-handling', 'digital-signature-and-hmac', 'secure-elements', 'device-identity-and-provisioning', 'aws-iot-and-azure', 'efuse-keys-and-key-storage', 'flash-encryption'],
  body: `In ordinary TLS the device checks the server, but the server learns nothing about the device: it needs a password or token on top. **Mutual TLS** (mTLS) closes the other direction. The server asks for a certificate, the device sends its own and proves that it owns the matching private key by signing a value both sides can see. The server checks the signatures up to a CA it trusts for devices. The simulation adds this step to the handshake.

### What each device holds

1. **The root that signs the server**, which it trusts, as before.
2. **Its own device certificate**, issued by a CA you control or by the cloud service, naming this unit (a serial number or address in the subject).
3. **The private key** that matches it, which exists in this unit and nowhere else.

### Why it beats a shared password

- **Identity is per device.** The server sees "device 0042", not "someone who knows the fleet password".
- **No secret crosses the wire.** The private key never leaves the device; the certificate is public by design, so a stolen list of certificates is harmless.
- **One device can be cut off alone.** Deny its certificate at the broker and the others carry on.
- **Services use it.** AWS IoT Core authenticates devices by X.509 certificates, Azure IoT Hub offers it, and many MQTT brokers can turn the certificate's name into a user name ([[aws-iot-and-azure]]).

### The hard part is the key

| Where the private key lives | Who can read it |
|---|---|
| Compiled into the firmware, the same in every unit | anyone with the firmware file; one leak breaks the fleet. Never. |
| Unique per device, in plain flash | anyone who holds the board |
| Unique per device, in encrypted flash or NVS | not by reading flash; code on the device still can |
| Behind the Digital Signature peripheral | no software: the hardware signs, the key is unusable without an eFuse key |
| In a secure element | nobody: it was made inside and never leaves |

By the catalogue, the Digital Signature peripheral exists on every chip except the original ESP32, the ESP32-C2 and the ESP8266 (RSA or ECDSA, depending on the chip). The best flow makes the key pair **on the device**, sends the CA only a signing request with the public half, and writes the signed certificate back ([[device-identity-and-provisioning]]).

### Traps

Device certificates often last many years, because a device with a wrong clock or no network cannot renew: decide the lifetime and plan rotation. The handshake is a little heavier. And a certificate says *who*, not *what it may do*: give each identity its own topics and limits at the broker.

> [!key] Mutual TLS gives every device its own cryptographic identity: a certificate anyone may see and a private key nobody may. Keep that key unique per device and out of reach of software where the chip allows, and let the server decide what each identity may do.`,
  ideas: [
    `In mutual TLS the server asks for a certificate and the device proves it holds the private key, so the server knows which device it is.`,
    `The private key never leaves the device and the certificate is public, so there is no shared secret to steal from a server or to leak from one unit.`,
    `A device can be revoked on its own, which a shared password does not allow.`,
    `All the security rests on the private key: unique per device, encrypted at rest, and ideally used only through the Digital Signature peripheral or a secure element.`
  ],
  pitfalls: [
    `The same certificate and key in every unit is mutual TLS — It is a shared password in a different form: one extracted key impersonates every device, and revoking it switches the whole fleet off.`,
    `A client certificate also says what the device may do — It says only who it is. Permissions are decided by the server, per identity, for example by topic.`,
    `Certificates are secret and must be hidden — Certificates are public. Only the private key is secret.`
  ],
  terms: [
    { term: `Mutual TLS`, also: [`mTLS`, `client authentication`, `two-way TLS`], def: `TLS in which the client authenticates to the server with a certificate as well as the server to the client. The server learns which device is calling without any shared password.` },
    { term: `Device certificate`, also: [`client certificate`, `X.509 device certificate`], def: `A certificate issued to one device, naming it and carrying its public key. The device presents it to the server and proves it holds the matching private key.` },
    { term: `Private key`, also: [`secret key`], def: `The half of a key pair that must stay secret. The device uses it to sign, and nobody else may ever see it; everything the certificate proves rests on it.` },
    { term: `Certificate signing request`, also: [`CSR`], def: `A message from a device to a CA containing the device's public key and name, signed with its private key. The CA answers with a certificate, and the private key never travels.` },
    { term: `Digital Signature peripheral`, also: [`DS`, `RSA_DS`, `ECDSA_DS`], def: `A hardware block of most ESP32 chips that signs with a private key which software cannot read: the key is stored encrypted with a key that only the hardware can use. It makes mutual TLS safe against code that steals keys.` }
  ],
  choose: {
    good: [`A fleet that needs to tell its devices apart and cut one off alone`, `Cloud services that already require X.509 device identity`, `A private CA that you run for your own fleet`],
    avoid: [`One shared certificate and key for all units`, `A private key in the source or in the shared firmware file`, `Giving every identity the same permissions at the broker`],
    check: [`Where the private key lives in each unit, and who can read that place`, `How long the device certificate lasts and how it is replaced`, `That the broker maps each certificate to its own topics and limits`]
  },
  code: [
    {
      title: `MQTT with a certificate for the device`,
      about: `The device checks the broker against the root, and the broker checks the device against its CA. The certificate and key are read from files of this one device, not from the shared source.`,
      needs: `An ESP32-family board with Wi-Fi, an MQTT broker that requires client certificates on port 8883, and three files on the board for this unit: the root of the broker's chain, the device certificate and its private key. Read [[credentials-handling]] before deciding where the key file lives.`,
      libs: [`PubSubClient`],
      blocks: `
        when started
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          sync the clock with [pool.ntp.org] :: net
          trust the root certificate [root_ca] :: security
          use this device's certificate [device_cert] and key [device_key] :: security
          connect to MQTT broker [broker.example.com] on port (8883) with TLS :: mqtt
          publish [online] to topic [devices/esp32-0001/status]
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <time.h>
        #include <LittleFS.h>
        #include <NetworkClientSecure.h>
        #include <PubSubClient.h>

        String rootCa, deviceCert, deviceKey;           // read from this unit's own files, never from shared source

        String readFile(const char *path) {
          File f = LittleFS.open(path, "r");
          if (!f) return "";
          String s = f.readString();
          f.close();
          return s;
        }

        NetworkClientSecure net;
        PubSubClient mqtt(net);

        void setup() {
          Serial.begin(115200);
          if (!LittleFS.begin(true)) return;
          rootCa = readFile("/root_ca.pem");
          deviceCert = readFile("/device_cert.pem");
          deviceKey = readFile("/device_key.pem");
          if (rootCa.isEmpty() || deviceCert.isEmpty() || deviceKey.isEmpty()) {
            Serial.println("this unit has no identity files");
            return;
          }

          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          configTime(0, 0, "pool.ntp.org");              // certificates have dates: the clock first
          struct tm t;
          if (!getLocalTime(&t, 10000)) return;

          net.setCACert(rootCa.c_str());                 // I check the broker...
          net.setCertificate(deviceCert.c_str());        // ...and the broker checks me
          net.setPrivateKey(deviceKey.c_str());
          mqtt.setServer("broker.example.com", 8883);
          if (mqtt.connect("esp32-0001")) {              // many brokers want the client id to match the certificate
            mqtt.publish("devices/esp32-0001/status", "online");
            Serial.println("connected with a device certificate");
          } else {
            Serial.printf("TLS or MQTT failed, state %d\n", mqtt.state());
          }
        }

        void loop() {
          mqtt.loop();
        }
      `,
      py: String.raw`
        import network, ntptime, ssl, time
        from umqtt.simple import MQTTClient

        def read(path):                                  # this unit's own files, never shared source
            with open(path, "rb") as f:
                return f.read()

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)
        ntptime.settime()                                # certificates have dates: the clock first

        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ctx.verify_mode = ssl.CERT_REQUIRED
        ctx.load_verify_locations(cadata=read("root_ca.der"))                  # I check the broker...
        ctx.load_cert_chain(read("device_cert.der"), read("device_key.der"))   # ...and the broker checks me

        client = MQTTClient("esp32-0001", "broker.example.com", port=8883, ssl=ctx)
        try:
            client.connect()
            client.publish(b"devices/esp32-0001/status", b"online")
            print("connected with a device certificate")
            client.disconnect()
        except OSError as e:
            print("TLS or MQTT failed:", e)
      `,
      output: `
        connected with a device certificate
      `,
      notes: [`The key file is only as safe as the flash it sits in: switch on flash encryption for a product ([[flash-encryption]]), or keep the key behind the Digital Signature peripheral ([[digital-signature-and-hmac]]).`, `The unit number appears in the client id and the topic: build both from the certificate's own name, so that a device cannot claim to be another.`, `The MicroPython form was written from the ssl documentation and not run on hardware: check that your build accepts the key and certificate as bytes.`]
    }
  ],
  quiz: [
    { q: `What does the server learn from a client certificate in mutual TLS that it does not learn in ordinary TLS?`, choices: [`Which network the device is on`, `Which device is calling, backed by proof that it holds the private key`, `How much battery is left`, `Nothing new: it only encrypts more`], a: 1, why: `The device signs a value in the handshake with its private key, and the server verifies the signature with the public key in the certificate. That ties the connection to one identity.` },
    { q: `The same device certificate and private key are compiled into every unit. What is wrong?`, choices: [`The handshake is slower`, `Extracting the key from one unit lets anyone impersonate all of them, and revoking it disables every unit`, `The broker cannot read the certificate`, `Nothing: certificates are public anyway`], a: 1, why: `The certificate is public, but the private key is the identity. A shared key is a shared password, with all its weaknesses.` },
    { q: `A device certificate can be published safely; only its private key has to stay secret.`, a: true, why: `A certificate contains the name and the public key and a signature, which anyone may see. Without the private key it cannot be used to prove anything.` },
    { q: `Why does the Digital Signature peripheral help a device that uses mutual TLS?`, choices: [`It makes the handshake take no time`, `Software, including a compromised program, can ask it to sign but can never read the private key`, `It replaces the root certificate`, `It encrypts the Wi-Fi link`], a: 1, why: `The key parameters are stored encrypted with a key held by the hardware. The program obtains signatures but never the key, so stealing the flash or the program does not yield an identity.` }
  ],
  applications: [
    `Fleets that connect to AWS IoT Core or another cloud with a certificate per device ([[aws-iot-and-azure]]).`,
    `Industrial gateways that must prove their identity to a plant server.`,
    `A home broker that accepts only your own devices, with a small private CA.`,
    `Devices that are sold and later transferred, where one identity must be revoked and re-issued alone.`
  ],
  sources: [
    `IETF RFC 8446, *The Transport Layer Security (TLS) Protocol Version 1.3*, the section on client authentication.`,
    `Arduino core for ESP32 documentation, the *NetworkClientSecure* library (setCertificate and setPrivateKey, core 3.3).`,
    `Espressif, *ESP-IDF Programming Guide*, the "Digital Signature (DS)" page of the chip you use.`
  ],
  sim: { id: 'cs-tls-handshake', params: { mutual: true } }
},

/* ================================================================ handling passwords and tokens */
{
  id: 'credentials-handling',
  parent: 'connection-security',
  title: 'Handling passwords and tokens',
  level: 2,
  short: `Wi-Fi passwords, broker passwords and tokens are the keys to the rest of your system. Keep them out of source code and shared firmware, give each device its own, store them where a thief cannot read them, and be ready to replace them.`,
  keywords: ['password', 'token', 'API key', 'secret', 'hard-coded credentials', 'secrets.h', 'Git', 'NVS', 'rotation', 'least privilege', 'default password', 'entropy', 'unique per device', 'serial log', 'leak'],
  prereq: ['nvs-and-preferences', 'iot-threat-model'],
  related: ['nvs-encryption', 'flash-encryption', 'efuse-keys-and-key-storage', 'secure-provisioning', 'wifi-provisioning', 'mutual-tls', 'random-numbers-and-chip-identity', 'regulations-cra-and-red'],
  body: `Every connected device holds secrets: the Wi-Fi passphrase, a broker password, an API token, a key for updates. Where they live decides what a leak costs.

### How secrets leak

- **In the source.** A password typed into a sketch is one commit from a public repository, and a repository remembers: deleting the line later does not delete the history. A secret that was ever public is public for good, so *change it*.
- **In the firmware file.** Compiled strings are easy to find. A .bin posted on a forum, a release page or an update server hands the secret to everyone who downloads it.
- **In the flash chip.** Anyone who holds the board can read the flash with a cable, unless flash encryption is on ([[flash-encryption]]).
- **In logs and URLs.** The serial port, cloud logs, and query strings such as \`?token=…\`, which land in server logs and browser history.
- **In one shared secret.** The same password in every unit means one extraction opens the whole fleet.

### Habits that fix it

1. **A secret per device.** Each unit gets its own at set-up or at the factory ([[secure-provisioning]]). A stolen unit then costs one unit.
2. **Out of the code.** Read secrets at run time from [[nvs-and-preferences|NVS]]: plain flash unless encrypted ([[nvs-encryption]]), with the key in the eFuses ([[efuse-keys-and-key-storage]]). Keep any \`secrets.h\` out of version control.
3. **Narrow scope.** A token that may only publish to its own topic is a nuisance if stolen; a cloud administrator key is a disaster. Prefer tokens that expire.
4. **A way to rotate.** Plan how to replace a secret on a live device and how to revoke one.
5. **Never show or send them.** No stored password in a web form or a log, no secret in a URL.
6. **No default.** A password such as "admin" in every unit is the oldest IoT fault, and now unlawful in places ([[regulations-cra-and-red]]).

### How strong is strong enough

A random code of $L$ symbols from an alphabet of $N$ has $L \\log_2 N$ bits. Six digits make 20 bits; twelve symbols from 32 make 60. Tried offline at ten billion guesses a second, 20 bits fall in a twentieth of a millisecond and 60 bits in about two years. A code that can only be tried *live*, a few times, is safe even at 20 bits ([[secure-provisioning]]).

> [!key] Keep secrets out of source and shared firmware, give every device its own, store it encrypted, give it the least power that works and plan how to replace it. A secret that has ever been public must be changed, whatever you delete afterwards.`,
  ideas: [
    `A secret in source code, a repository or the shared firmware file is effectively published; deleting it later does not unpublish it.`,
    `A unique secret per device limits a leak to one unit; one shared secret loses the fleet.`,
    `Flash is readable by anyone holding the board unless flash and NVS encryption are on.`,
    `Give each token the narrowest scope, make it replaceable, and never put it in a URL or a log.`
  ],
  pitfalls: [
    `I deleted the password from the repository, so it is safe — The history still has it, and so does every clone. Treat it as public and change it.`,
    `The firmware is binary, so nobody can read the password in it — Strings in a binary are found in seconds, and anyone with the file or the board can do it.`,
    `A six-digit code is too weak — Only if it can be tried offline or without limit. As a set-up code with a few live attempts allowed, 20 bits are enough.`
  ],
  terms: [
    { term: `Secret`, also: [`credential`, `password`, `key`], def: `A piece of data that grants access and must be known only to those entitled: a Wi-Fi passphrase, a broker password, an API token, a private key.` },
    { term: `Hard-coded credential`, also: [`embedded password`, `default password`], def: `A password or key written into the program itself. It is the same in every copy of the firmware and readable by anyone who obtains it.` },
    { term: `Least privilege`, also: [`scope`, `narrow token`], def: `Giving a credential only the permissions its job needs, such as publishing to its own topic, so that stealing it gains little.` },
    { term: `Rotation`, also: [`key rotation`, `revocation`], def: `Replacing a secret with a new one on a schedule or after a leak, and invalidating the old one. A device needs a way to receive the new secret for it to be possible.` },
    { term: `Entropy`, also: [`strength in bits`, `randomness`], def: `A measure of how unpredictable a secret is: a random code of L symbols from an alphabet of N has L times log2 of N bits. Each extra bit doubles the guesses needed.` },
    { term: `Token`, also: [`API key`, `bearer token`, `access token`], def: `A string that proves the right to use a service, passed in place of a password. Whoever holds it can use it, so it needs the same care and, ideally, an expiry date.` }
  ],
  choose: {
    good: [`A unique secret per device, made at the factory or at set-up`, `Encrypted NVS together with flash encryption for a product`, `A key behind the HMAC or Digital Signature peripheral, or in a secure element, where the device must prove itself`],
    avoid: [`A password in the sketch, in the repository or in the shared firmware`, `The same secret in every unit`, `A secret in a URL, a log line or a web form`],
    check: [`What a stranger holding one unit can read from its flash`, `Whether a leaked secret can be replaced on a live device`, `How much that one token is allowed to do`]
  },
  formulas: [
    {
      name: `Strength of a random code`,
      expr: 'H = L*log2(N)',
      tex: 'H = L\\,\\log_2 N',
      vars: {
        H: { name: 'strength', unit: 'bits' },
        L: { name: 'length of the code', q: 'count', value: 12, min: 1, max: 64, int: true },
        N: { name: 'symbols to choose from', q: 'count', value: 32, min: 2, max: 256, int: true }
      },
      solveFor: 'H',
      note: `For a code chosen at random. A passphrase of words chosen by a person is far weaker than this: people are not random. Six digits is 20 bits, twelve of 32 symbols is 60 bits.`
    },
    {
      name: `Average time to find a code by guessing`,
      expr: 't = 2^(H-1)/r',
      tex: 't = \\frac{2^{H-1}}{r}',
      vars: {
        t: { name: 'average time to find it', q: 'time', unit: 's' },
        H: { name: 'strength', unit: 'bits', value: 60, min: 1, max: 128 },
        r: { name: 'guesses per second', q: 'frequency', unit: 'Hz', value: 1e10, min: 1 }
      },
      solveFor: 't',
      note: `On average half the possibilities must be tried. The rate depends on who can test: offline against a recording or a stolen hash, billions a second; online against a device, a few a minute.`
    }
  ],
  code: [
    {
      title: `A set-up code made on the device, not compiled in`,
      about: `On first boot the device makes its own 12-symbol code from the hardware random generator and keeps it in flash. Every unit therefore has a different one, and the source holds none.`,
      needs: `Any ESP32-family board. In a product the code would be printed on the label at the factory and never sent to the serial port; here it is printed so that you can see it.`,
      blocks: `
        when started
          start serial at (115200) baud
          set [code v] to (load [setup])
          if <(length of (code)) = (0)> then
            set [code v] to (random code of (12) characters from [23456789ABCDEFGHJKLMNPQRSTUVWXYZ])
            save (code) as [setup]
            print [new set-up code made: print it on the label]
          end
          print (join [set-up code: ] (code))
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <Preferences.h>
        #include <esp_random.h>

        Preferences prefs;

        // 12 symbols from 32 that cannot be mistaken for each other: 60 bits, easy to read off a label
        String newCode() {
          const char SYMBOLS[] = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";   // exactly 32 characters, no 0 O 1 I
          String code;
          for (int i = 0; i < 12; i++) {
            code += SYMBOLS[esp_random() & 31];                          // 32 symbols: no modulo bias
          }
          return code;
        }

        void setup() {
          Serial.begin(115200);
          WiFi.mode(WIFI_STA);                       // radio on: the random generator is a true one only while it runs
          prefs.begin("device", false);
          String code = prefs.getString("setup", "");
          if (code.length() == 0) {                  // first boot: make one and keep it
            code = newCode();
            prefs.putString("setup", code);
            Serial.println("new set-up code made: print it on the label");
          }
          prefs.end();
          Serial.println("set-up code: " + code);    // a product would not print this
        }

        void loop() {}
      `,
      py: String.raw`
        import os, esp32, network

        SYMBOLS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"     # exactly 32 characters, no 0 O 1 I

        def new_code():
            return "".join(SYMBOLS[b & 31] for b in os.urandom(12))     # 32 symbols: no modulo bias

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)                    # radio on: the random generator is a true one only while it runs

        nvs = esp32.NVS("device")
        buf = bytearray(32)
        try:
            n = nvs.get_blob("setup", buf)
            code = bytes(buf[:n]).decode()
        except OSError:                      # first boot: nothing stored yet
            code = new_code()
            nvs.set_blob("setup", code.encode())
            nvs.commit()                     # REQUIRED or the change is lost
            print("new set-up code made: print it on the label")
        print("set-up code:", code)          # a product would not print this
      `,
      output: `
        new set-up code made: print it on the label
        set-up code: K7QX4M9TD2HB
      `,
      notes: [`On the next boot only the second line appears: the code was kept. A factory reset that erases the namespace makes a new one.`, `The chip's random generator is a true one only while Wi-Fi or Bluetooth is running, which is why the radio is switched on first ([[random-numbers-and-chip-identity]]).`, `The stored value is plain flash. For a product turn on NVS encryption and flash encryption ([[nvs-encryption]]).`]
    }
  ],
  quiz: [
    { q: `You committed a Wi-Fi password to a Git repository, then deleted it in the next commit. Is it safe?`, choices: [`Yes: the current version no longer contains it`, `No: the history and every clone still have it, so the password must be changed`, `Yes, if the repository is private`, `Yes, after the next firmware update`], a: 1, why: `A repository keeps every version. Anyone with access to the history, now or later, can read the old line. A secret that has been exposed has to be replaced.` },
    { q: `The same MQTT password is compiled into every unit. What is the main risk?`, choices: [`The password is too long`, `One extracted password gives access as any device, and it cannot be revoked for one unit alone`, `The broker will refuse duplicate passwords`, `The firmware becomes larger`], a: 1, why: `A leak from one device exposes the whole fleet, and replacing the password means updating every unit at once. A secret per device limits both problems.` },
    { q: `Which gives the least to someone who holds the board and reads its flash?`, choices: [`A password in the sketch`, `A password in NVS without encryption`, `A key kept by NVS encryption and flash encryption, with its key in the eFuses`, `A password in the Wi-Fi name`], a: 2, why: `Plain flash, whether holding the sketch's strings or an NVS entry, can be read with a cable and a computer. Encrypted flash needs a key the reader does not have.` },
    { q: `A six-digit set-up code is always too weak.`, a: false, why: `Six digits are only 20 bits, which is nothing against unlimited offline guessing. As a code that can be tried live only a few times, in a protocol that gives an eavesdropper nothing to test against, it is sufficient. See the page on secure provisioning.` }
  ],
  applications: [
    `A per-device set-up code printed on a label or shown as a QR code ([[secure-provisioning]]).`,
    `Wi-Fi and broker credentials entered at set-up and kept in NVS ([[wifi-provisioning]]).`,
    `API tokens for a cloud service, scoped to one device and replaced when it is sold on.`,
    `Reviewing a project before publishing it: search the whole history for secrets first.`
  ],
  sources: [
    `Arduino core for ESP32 documentation, the *Preferences* library (core 3.3).`,
    `Espressif, *ESP-IDF Programming Guide*, the "NVS Encryption" and "Flash Encryption" pages (5.5 and 6.x).`,
    `ETSI EN 303 645, *Cyber Security for Consumer Internet of Things: Baseline Requirements* (no universal default passwords; secure storage of credentials).`
  ],
  sim: 'cs-secret-location'
}
,

/* ================================================================ secure provisioning */
{
  id: 'secure-provisioning',
  parent: 'connection-security',
  title: 'Secure provisioning',
  level: 2,
  short: `The minutes in which a device is new and unowned are the most exposed of its life. Who may set it up, who can overhear, and how each side knows it has the right one: a per-unit secret, a short window, an encrypted exchange and a way back.`,
  keywords: ['provisioning', 'proof of possession', 'PoP', 'set-up window', 'SRP', 'SPAKE2+', 'QR code', 'claim', 'factory reset', 'first come first served', 'soft AP', 'BLE provisioning', 'Matter setup code', 'unique PIN', 'onboarding'],
  prereq: ['wifi-provisioning', 'credentials-handling'],
  related: ['soft-ap-and-captive-portal', 'ble-security', 'ble-security-practice', 'matter-commissioning', 'device-identity-and-provisioning', 'nvs-encryption', 'wifi-network-security'],
  body: `[[wifi-provisioning]] shows how credentials reach a device. This page is about doing it without opening a hole, because the minutes in which a device is **new and unowned** are the most exposed of its life. Three questions decide it: *who may set it up?*, *who can overhear?* and *how does each side know it is talking to the right one?*

### Four weak spots

| Weak spot | What goes wrong | The defence |
|---|---|---|
| Open set-up network, plain form | anyone nearby can join and read the Wi-Fi password as it is sent | a password on the set-up network, or an encrypted channel |
| First come, first served | whoever connects first becomes the owner: a neighbour, a passer-by | a physical action to open the window, and a secret only the owner can know |
| No proof of which device | the phone cannot tell your device from a look-alike with the same name | a per-unit secret that both sides must show they know |
| The window never closes | the set-up network sits there for ever, or comes back by itself | a time limit, closure on success, and re-opening only by a deliberate reset |

### A secret that comes with the unit

The **proof of possession** is a secret that only someone holding the device, its box or its label can know: a PIN or key printed on the label or shown as a QR code, **different in every unit**, made at the factory or at the first boot ([[credentials-handling]]). Espressif's unified provisioning offers three levels: none, a key exchange with that secret mixed in, and a password-authenticated exchange (SRP). Matter's commissioning uses a similar exchange with its setup code ([[matter-commissioning]]). A good exchange gives an eavesdropper nothing to test guesses against, so a *short* code stays safe while the number of *live* attempts is small: the chance of hitting it in $k$ tries is $k / N^L$ (calculator below).

### After the set-up

- **Store** the credentials in encrypted NVS ([[nvs-encryption]]) and stop offering set-up.
- **Keep a way back.** A button held for several seconds erases the credentials and the owner's claims and reopens set-up, for a sale or a mistake. It must need physical access.
- **Show the state.** An LED pattern or a short beep tells the user that set-up is open, so that a window is not left open unnoticed.
- **Never accept new credentials over the normal network** unless ownership is proved.

> [!key] Provision with a secret that comes with each unit, a window that needs a deliberate act and closes by itself, and an exchange that does not give an eavesdropper the password. Then keep a physical way to start again.`,
  ideas: [
    `A new device is exposed until it is set up: anyone nearby can overhear an open set-up, or arrive first and become the owner.`,
    `A per-unit proof of possession, printed on the label or in a QR code, shows that the person setting up holds the device.`,
    `A good exchange gives an eavesdropper nothing to test guesses against, so a short code is safe when the live attempts are few.`,
    `The set-up window should need a physical act, close by itself and reopen only through a deliberate reset.`
  ],
  pitfalls: [
    `An open set-up network is fine because it only runs for a minute — A minute is long enough for anyone nearby to join and read the form, or to set the device up before the owner does.`,
    `One PIN for the whole product line is a proof of possession — Every owner of the product knows it. It must be different in every unit.`,
    `Once the device is set up the job is done — The way back matters too: a factory reset that erases the credentials and the claims, so that a sold or lost device does not stay tied to its old owner.`
  ],
  terms: [
    { term: `Set-up window`, also: [`provisioning window`, `pairing window`], def: `The limited time during which a device offers set-up. A safe window opens by a deliberate physical act, lasts minutes, and closes by itself or on success.` },
    { term: `Proof of possession`, also: [`PoP`, `set-up code`, `setup passcode`], def: `A secret, different in every unit, that only someone holding the device or its label can know. The phone must show it knows it before the device accepts credentials.` },
    { term: `Password-authenticated key exchange`, also: [`PAKE`, `SRP`, `SPAKE2+`], def: `A way for two sides that share a short secret to agree on a strong key without sending it. An eavesdropper learns nothing to test guesses against, so only live attempts count.` },
    { term: `First come, first served`, also: [`trust on first use`, `TOFU`], def: `A set-up flow in which the first party to connect becomes the owner. It is easy for the user and open to a stranger who is faster.` },
    { term: `Factory reset`, also: [`reset to defaults`, `unclaim`], def: `A deliberate action, usually a long button press, that erases the saved credentials and owner claims and puts the device back into set-up mode.` }
  ],
  choose: {
    good: [`A button held for several seconds to open set-up, with an LED showing the state`, `A per-unit code on the label or in a QR code, used in an exchange that hides it from listeners`, `A window of a few minutes that closes by itself`],
    avoid: [`A set-up network that is open and always on`, `One fixed PIN in every unit`, `Accepting new credentials from anyone on the normal network`],
    check: [`What a stranger standing outside can see and do while set-up is open`, `That a long press erases the credentials and the cloud claim`, `That the window closes when the user walks away`]
  },
  formulas: [
    {
      name: `Chance of guessing a code in the attempts allowed`,
      expr: 'P = k/N^L',
      tex: 'P = \\frac{k}{N^{L}}',
      vars: {
        P: { name: 'chance that a stranger gets in', q: 'ratio', unit: '%' },
        k: { name: 'live attempts allowed', q: 'count', value: 3, min: 1, int: true },
        N: { name: 'symbols to choose from', q: 'count', value: 10, min: 2, max: 256, int: true },
        L: { name: 'length of the code', q: 'count', value: 6, min: 1, max: 32, int: true }
      },
      solveFor: 'P',
      note: `Valid when the protocol lets an eavesdropper test nothing offline and the device refuses after k attempts. Six digits and three tries give three chances in a million; without the limit the same code is worthless.`
    }
  ],
  code: [
    {
      title: `A set-up window that opens on a button and closes by itself`,
      about: `The set-up network exists only after the BOOT button has been held for three seconds, is protected by this unit's own code, and disappears after five minutes. The form that takes the Wi-Fi name and password is the one on the provisioning page; this is the safe frame around it.`,
      needs: `An ESP32-family board with the BOOT button, and a code already stored by the program on the previous page (credentials-handling). The button is GPIO0; on C3 and C6 boards use GPIO9.`,
      wiring: [[`GPIO0`, `the BOOT button to GND`, `already on the board; GPIO9 on C3 and C6`]],
      blocks: `
        when started
          set pin (0) as [input with pull-up v]
          set [code v] to (load [setup])
          set [open v] to <false>
          set [pressed v] to (0)

        forever
          if <(read pin (0)) = [LOW v]> then
            if <(pressed) = (0)> then
              set [pressed v] to (milliseconds since start)
            end
            if <<not <open>> and <((milliseconds since start) - (pressed)) ≥ (3000)>> then
              open the set-up network [device-setup] with password (code) :: wifi
              set [open v] to <true>
              set [opened v] to (milliseconds since start)
              print [set-up window open for 5 minutes]
            end
          else
            set [pressed v] to (0)
          end
          if <<open> and <((milliseconds since start) - (opened)) ≥ (300000)>> then
            close the set-up network :: wifi
            set [open v] to <false>
            print [set-up window closed]
          end
        end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <Preferences.h>

        const int BUTTON = 0;                            // the BOOT button; GPIO9 on C3 and C6 boards
        const uint32_t HOLD_MS = 3000;                   // hold it three seconds to open set-up
        const uint32_t WINDOW_MS = 5UL * 60UL * 1000UL;  // the set-up network lives for five minutes

        String code;                                     // this unit's own code, made at the first boot
        bool windowOpen = false, pressing = false;
        uint32_t pressedAt = 0, openedAt = 0;

        void openWindow() {
          WiFi.mode(WIFI_AP);
          WiFi.softAP("device-setup", code.c_str());     // WPA2: the password is the code on the label
          windowOpen = true;
          openedAt = millis();
          Serial.println("set-up window open for 5 minutes");
        }

        void closeWindow() {
          WiFi.softAPdisconnect(true);                   // the network disappears
          windowOpen = false;
          Serial.println("set-up window closed");
        }

        void setup() {
          Serial.begin(115200);
          pinMode(BUTTON, INPUT_PULLUP);
          Preferences prefs;
          prefs.begin("device", true);                   // read-only: the code was made earlier
          code = prefs.getString("setup", "");
          prefs.end();
          if (code.length() < 8) Serial.println("no set-up code: the window will not open");
        }

        void loop() {
          bool down = digitalRead(BUTTON) == LOW;
          if (down && !pressing) { pressing = true; pressedAt = millis(); }
          if (!down) pressing = false;
          if (!windowOpen && pressing && code.length() >= 8 && millis() - pressedAt >= HOLD_MS) openWindow();
          if (windowOpen && millis() - openedAt >= WINDOW_MS) closeWindow();
        }
      `,
      py: String.raw`
        import network, esp32, time
        from machine import Pin

        HOLD_MS = 3000                                   # hold the button three seconds to open set-up
        WINDOW_MS = 5 * 60 * 1000                        # the set-up network lives for five minutes

        button = Pin(0, Pin.IN, Pin.PULL_UP)             # the BOOT button; GPIO9 on C3 and C6 boards
        ap = network.WLAN(network.WLAN.IF_AP)

        nvs = esp32.NVS("device")                        # this unit's own code, made at the first boot
        buf = bytearray(32)
        try:
            n = nvs.get_blob("setup", buf)
            code = bytes(buf[:n]).decode()
        except OSError:
            code = ""
        if len(code) < 8:
            print("no set-up code: the window will not open")

        window_open = False
        pressed_at = None
        opened_at = 0

        while True:
            if button.value() == 0:                      # pressed
                if pressed_at is None:
                    pressed_at = time.ticks_ms()
            else:
                pressed_at = None
            if (not window_open and pressed_at is not None and len(code) >= 8
                    and time.ticks_diff(time.ticks_ms(), pressed_at) >= HOLD_MS):
                ap.config(ssid="device-setup", password=code, security=network.WLAN.SEC_WPA2, max_clients=1)
                ap.active(True)                          # WPA2: the password is the code on the label
                window_open = True
                opened_at = time.ticks_ms()
                print("set-up window open for 5 minutes")
            if window_open and time.ticks_diff(time.ticks_ms(), opened_at) >= WINDOW_MS:
                ap.active(False)                         # the network disappears
                window_open = False
                print("set-up window closed")
            time.sleep_ms(50)
      `,
      output: `
        set-up window open for 5 minutes
        set-up window closed
      `,
      notes: [`The second line appears five minutes after the first. A product would also light an LED while the window is open and close it as soon as the credentials have been received.`, `The set-up network is WPA2 with the unit's own code as its password, so a stranger cannot join it and the form travels encrypted over the radio link.`, `Do not hold the BOOT button while resetting the board: that is the download-mode gesture ([[strapping-pins]]).`]
    }
  ],
  quiz: [
    { q: `A product opens an open (password-free) set-up network whenever it has no saved Wi-Fi. What is the main problem?`, choices: [`It uses too much current`, `Anyone nearby can join it, read the credentials as they are sent, or set the device up first`, `Phones cannot find open networks`, `It cannot be switched off`], a: 1, why: `With no password and no secret in the exchange, the set-up is first come, first served, and everything sent over the open network can be read by a listener.` },
    { q: `Every unit of a product has the same PIN printed in the manual. As a proof of possession it is`, choices: [`Strong, because it is printed`, `Weak, because everyone who has the manual, or any unit, knows it`, `Strong, if it has eight digits`, `Unnecessary`], a: 1, why: `The point of a proof of possession is that only the holder of this unit knows it. A shared code is known to every owner and every reader of the manual.` },
    { q: `A six-digit code is protected by a password-authenticated exchange and the device refuses after three wrong tries. The chance that a stranger guesses it is`, choices: [`About 3 in 1 000 000`, `About 1 in 2`, `Certain, given enough time`, `Zero`], a: 0, why: `With nothing to test offline, each live attempt is one guess in 10^6, and only three are allowed: 3 / 10^6.` },
    { q: `After provisioning, the set-up network may stay on in case the user wants to change something.`, a: false, why: `A window that stays open is an open door. Close it, and reopen it only by a deliberate physical action such as a long button press.` }
  ],
  applications: [
    `Smart plugs and bulbs that open a set-up network when a button is held.`,
    `Devices provisioned over Bluetooth LE with Espressif's phone apps and a printed code ([[wifi-provisioning]]).`,
    `Matter devices commissioned with a setup code or QR code ([[matter-commissioning]]).`,
    `Second-hand sales: a factory reset that releases the device from its previous owner.`
  ],
  sources: [
    `Espressif, *ESP-IDF Programming Guide*, the "Unified Provisioning" and "Wi-Fi Provisioning" pages (security schemes and proof of possession, 5.5 and 6.x).`,
    `Arduino core for ESP32 documentation, the *WiFi* soft AP API and the *WiFiProv* library (core 3.3).`,
    `ETSI EN 303 645, *Cyber Security for Consumer Internet of Things: Baseline Requirements*.`
  ],
  sim: 'cs-provisioning'
},

/* ================================================================ a safe Wi-Fi network for devices */
{
  id: 'wifi-network-security',
  parent: 'connection-security',
  title: 'A safe Wi-Fi network for devices',
  level: 2,
  short: `A smart plug or an ESP sensor is a small computer that is updated less often than your laptop. Put such devices on a network of their own, decide what may cross, and ask what a compromised device could reach rather than whether it can be trusted.`,
  keywords: ['IoT network', 'VLAN', 'guest network', 'client isolation', 'AP isolation', 'segmentation', 'firewall', 'UPnP', 'port forwarding', 'blast radius', 'WPA3', 'router', 'mDNS', 'Home Assistant', 'remote access', 'VPN'],
  prereq: ['wifi-security', 'iot-threat-model'],
  related: ['mdns', 'secure-provisioning', 'web-interface-security', 'home-assistant-integration', 'vulnerabilities-and-updates', 'tls-on-esp', 'mqtt'],
  body: `A smart plug, a camera or an ESP sensor is a small computer that is updated less often than your laptop. The useful question for the network is not "can it be trusted?" but "**what can it reach if it goes wrong?**" [[wifi-security]] covers the radio link; this page is about the network behind the access point.

### Give devices their own network

Put IoT devices on a network of their own: a guest or IoT SSID with client isolation, or better a VLAN with firewall rules. The router then decides what may cross:

| From | To | Allow? |
|---|---|---|
| IoT device | the internet: DNS, time, HTTPS, MQTT over TLS | yes, only those |
| IoT device | your laptop, phone, file server | no |
| IoT device | another IoT device | no, except a hub to its own devices |
| Your phone or controller | IoT device | yes, new connections in this direction only |

The simulation shows what a compromised device can reach in each arrangement.

### What it costs

- **Discovery stops at the border.** mDNS announcements do not cross networks by themselves, so a phone cannot find a device by name ([[mdns]]). Use a reflector on the router, or put the controller (Home Assistant, say) in the same segment.
- **Set-up apps** often want the phone on the same network as the device.
- **ESP-NOW and Bluetooth** are not on the LAN at all and ignore every rule here.

### The basics around it

- **WPA2 or WPA3 with a long random passphrase**, a different one for each network ([[wifi-security]]). The ESP8266 speaks only WPA2, so a WPA3-only network locks out old devices; transition mode serves both.
- **The router itself:** a strong administrator password, current firmware, UPnP off, and no port forwarded to a device. For remote access use a VPN, or let the device call out to a broker over TLS ([[mqtt]]).
- **2.4 GHz.** Among the microcontrollers only the ESP32-C5 has a 5 GHz radio: an IoT network offered on 5 GHz alone is invisible to every other ESP.
- **Addresses.** DHCP reservations make firewall rules and logs readable. Keep visitors on a third, guest network.
- **Your own soft AP** gets a password and a closing time ([[secure-provisioning]]).

> [!key] Separate IoT devices from the computers that hold your data, allow only the traffic they need, and keep the router itself updated and closed to the internet. Segmentation limits the damage of a bad device; it does not make a vulnerable one safe, so keep updating too.`,
  ideas: [
    `Ask what a device can reach if it is compromised, not whether it is trustworthy: the answer sets how much damage one weak device can do.`,
    `A separate IoT network, with client isolation or firewall rules, keeps a bad device away from computers and files.`,
    `Segmentation has costs: local discovery and set-up apps need a bridge or a shared segment.`,
    `The router is part of the defence: a strong administrator password, current firmware, no UPnP, no forwarded ports.`
  ],
  pitfalls: [
    `A hidden SSID and a MAC allow-list protect the network — Both are visible on the air and neither stops a determined neighbour. Use WPA2 or WPA3 and a separate IoT network instead.`,
    `A guest network is the same as an IoT VLAN — Guest networks usually isolate devices from the main network, which also stops your phone controlling them locally. A VLAN with rules lets you allow one direction.`,
    `Forwarding a port is the easy way to reach a device from outside — It exposes the device to the whole internet, which is scanned continuously. Use a VPN or have the device call out over TLS.`
  ],
  terms: [
    { term: `VLAN`, also: [`virtual LAN`, `network segment`], def: `A way to split one physical network into separate logical networks. The router or switch decides which traffic may pass between them.` },
    { term: `Client isolation`, also: [`AP isolation`, `guest network`], def: `A router setting that stops devices on the same Wi-Fi network from talking to each other or to the main network, leaving them only the internet.` },
    { term: `Blast radius`, also: [`what a compromise can reach`], def: `The extent of what an attacker can reach from one compromised device. Segmentation, unique credentials and narrow tokens are all ways of making it small.` },
    { term: `Port forwarding`, also: [`UPnP`, `NAT rule`], def: `A router rule, set by hand or automatically through UPnP, that lets the internet reach a device on the home network. It exposes the device to everyone.` },
    { term: `mDNS reflector`, also: [`mDNS repeater`, `Avahi reflector`], def: `A service on the router that copies mDNS name announcements between networks, so that devices can be found by name across a segment boundary.` }
  ],
  choose: {
    good: [`An IoT VLAN with rules when the router can do it`, `A guest or IoT SSID with isolation when it cannot, accepting that local control needs the cloud`, `A VPN, or an outgoing TLS connection to a broker, for remote access`],
    avoid: [`Everything on one flat network with the laptops and the file server`, `UPnP or a forwarded port to an IoT device`, `A router with the factory administrator password`],
    check: [`What a bad device could reach: test it from a spare device on the IoT network`, `That the controller can still reach the devices it must, and no others`, `The router's firmware date`]
  },
  quiz: [
    { q: `A camera on your IoT network is compromised. With a VLAN and rules that deny IoT to the main network, what can it reach?`, choices: [`Your laptop and files`, `The internet and the few services the rules allow, not your laptop`, `Nothing at all`, `Everything, since it is on Wi-Fi`], a: 1, why: `The rules block new connections from the IoT segment into the main network. The camera keeps its internet access, so it can still misbehave outwards, but your computers are out of reach.` },
    { q: `You put every smart bulb on a guest network with client isolation and your phone can no longer control them locally. Why?`, choices: [`Bulbs do not work on guest networks`, `Isolation also stops the phone, on the main network, from reaching them`, `The bulbs lost their IP addresses`, `The phone needs a firmware update`], a: 1, why: `Guest isolation is blind to direction: nothing crosses. A VLAN with a rule allowing connections from the controller to the devices gives the isolation without losing local control.` },
    { q: `Forwarding a port from the router to an ESP web page is a safe way to reach it from outside, as long as the page has a password.`, a: false, why: `The page is then open to the whole internet, which is scanned all the time, and any weakness in the ESP's code is exposed. Use a VPN or a broker the device connects out to.` },
    { q: `A WPA3-only IoT network is chosen. Which device may fail to join?`, choices: [`An ESP32-S3`, `An ESP8266 board`, `An ESP32-C6`, `A phone`], a: 1, why: `By the catalogue the ESP8266 speaks WPA and WPA2 only. Transition mode, which accepts both WPA2 and WPA3, lets old and new devices share the network.` }
  ],
  applications: [
    `A home with cameras, plugs and bulbs kept away from the family's laptops.`,
    `A workshop where test boards sit on their own segment and cannot touch the office network.`,
    `A rental or guest flat with a Home Assistant box that is the only thing allowed to talk to the devices.`,
    `Remote access to a home controller through a VPN instead of an open port.`
  ],
  sources: [
    `NIST, *NIST IR 8259A, IoT Device Cybersecurity Capability Core Baseline*.`,
    `ETSI EN 303 645, *Cyber Security for Consumer Internet of Things: Baseline Requirements*.`,
    `Espressif, *ESP-IDF Programming Guide*, the "Wi-Fi Security" page (WPA2, WPA3 and protected management frames).`
  ],
  sim: 'cs-iot-segment'
},

/* ================================================================ Bluetooth security in practice */
{
  id: 'ble-security-practice',
  parent: 'connection-security',
  title: 'Bluetooth security in practice',
  level: 2,
  short: `What is public whatever you do, which pairing to choose for the hardware you have, how to make each characteristic enforce it, and why a command that acts needs its own signature and counter on top of pairing.`,
  keywords: ['BLE security', 'pairing', 'Just Works', 'passkey', 'bonding', 'accept list', 'whitelist', 'private address', 'replay', 'HMAC', 'counter', 'challenge response', 'lock', 'out of band', 'characteristic permissions', 'advertising data'],
  prereq: ['ble-security', 'credentials-handling'],
  related: ['secure-provisioning', 'mutual-tls', 'wifi-provisioning', 'iot-threat-model', 'ble-hid', 'secure-ota'],
  body: `[[ble-security]] explains how pairing makes keys. This page is about the decisions around it in a real product: what is public anyway, which pairing to choose, how to make each characteristic enforce it, and why a command that *acts* needs a check of its own.

### What is public whatever you do

Advertising packets are heard by every receiver in range: the name, the services and any manufacturer data, including a sensor value you put there. A connectable device can be probed by anyone close by. So keep secrets and readings you would not shout in the street out of advertising data, use private addresses that change so that a device cannot be followed, and never treat an unusual UUID as a password.

### Choose the pairing by what the device has

| The device has | Use | Remember |
|---|---|---|
| a screen or a keypad | LE Secure Connections with numeric comparison or a passkey | stops a man in the middle |
| only a button and an LED | Just Works, pairable only while the button is held or for a few minutes, plus a per-unit secret checked by your own protocol | encrypts, but does not identify |
| NFC or a QR code | the code carried out of band | a strong and cheap choice |

Ask for Secure Connections only where the stack allows it, and never use legacy pairing in a new design.

### Make the stack enforce it

Mark every characteristic that matters *encrypted* or *authenticated*, so that the stack refuses it on an open link. After set-up accept connections only from bonded devices (an accept list). Offer pairing only in a set-up window, keep the bonds in flash so that users are not asked to re-pair after every reset, and give a way to remove one bond and a long press that removes them all.

### A command that acts needs its own check

Pairing protects a link, not a command. If pairing is open to anyone nearby, as with Just Works, a paired link proves nothing about *who* is paired. For a lock, a valve or a door, sign every command with a key that only the owner's app holds, and number the commands (or send a fresh challenge), so that a recording of a valid command is useless later. The program checks a signature and a counter; the simulation compares the schemes. On a properly authenticated encrypted link the link layer already refuses replays: the counter protects connectionless messages and links whose pairing was not authenticated.

### Traps

- One fixed passkey for every unit of a product.
- Bond keys kept in RAM only, so the bond vanishes at each reset and users switch security off.
- Wi-Fi credentials written to a characteristic that does not need an authenticated link.
- The phone side forgotten: an app that keeps the key in plain text undoes the lock.

> [!key] Assume advertising is public, pair as strongly as the hardware allows, make the stack refuse unauthenticated access, and sign and number every command that acts, so that being paired is never the only thing standing between a stranger and your lock.`,
  ideas: [
    `Everything in advertising packets is public; connectable devices can be probed by anyone close.`,
    `Choose the pairing method by the device's inputs and outputs, and open pairing only for a short, deliberate window.`,
    `Mark sensitive characteristics encrypted or authenticated, and accept only bonded devices after set-up.`,
    `A command that acts needs its own signature and counter or challenge, so that recordings cannot be replayed.`
  ],
  pitfalls: [
    `Being paired proves the user is the owner — With Just Works anyone can pair. Pairing encrypts a link; it does not say who is on the other end.`,
    `A secret UUID or a hidden name keeps strangers out — Both are broadcast or readable by anyone who connects. They are labels, not passwords.`,
    `A rolling counter is enough on its own — Without a signature anyone can send a bigger number. Sign the counter and the command together, and compare in constant time.`
  ],
  terms: [
    { term: `Replay attack`, also: [`replay`], def: `Recording a valid message and sending it again later to make the receiver repeat the action. A signature alone does not stop it; a counter or a fresh challenge does.` },
    { term: `HMAC`, also: [`message authentication code`, `MAC`, `tag`], def: `A short value computed from a message and a secret key with a hash function. Only someone who knows the key can make a tag that fits a message, so the receiver can detect forgery and alteration.` },
    { term: `Challenge and response`, also: [`nonce`, `challenge`], def: `A scheme in which the receiver sends a fresh random value, and the sender proves it knows the key by returning a tag over that value. An old recording answers an old challenge and is refused.` },
    { term: `Filter accept list`, also: [`accept list`, `whitelist`], def: `A list of device addresses that a Bluetooth controller will accept connections from, and ignore everyone else. It is used after set-up to admit only bonded devices.` },
    { term: `Out-of-band pairing`, also: [`OOB`, `NFC pairing`, `QR pairing`], def: `Pairing in which the key material travels by another channel than Bluetooth, such as NFC or a QR code. It resists a man in the middle on the radio.` },
    { term: `Resolvable private address`, also: [`RPA`, `private address`, `address privacy`], def: `A Bluetooth address that changes every few minutes and that only a bonded peer can recognise. It stops a device from being tracked by its address.` }
  ],
  choose: {
    good: [`Numeric comparison or passkey with Secure Connections when there is a screen or a keypad`, `Just Works in a short window, with your own signed commands, for a device with only a button`, `An accept list after set-up`],
    avoid: [`One fixed passkey for every unit`, `Secrets or private readings in advertising data`, `Unauthenticated characteristics that act, such as a lock or a valve`],
    check: [`What a stranger can do with no pairing, and with Just Works pairing`, `How a lost phone is removed from the device`, `That bonds survive a reset and a firmware update`]
  },
  code: [
    {
      title: `Accept a command only once`,
      about: `A command arrives with a counter and a tag, an HMAC-SHA-256 over both. The device refuses a wrong tag and any counter that is not higher than the last accepted one. This self-test shows a fresh command, a replay and an altered command; in a product the same check sits in the characteristic's write callback.`,
      needs: `Any ESP32-family board. The key is a test value: in a product it is unique per device, set up with the owner's phone and kept in encrypted NVS ([[credentials-handling]]).`,
      blocks: `
        define accept (counter) (command) (tag)
          set [result v] to [refused]
          if <(tag) = (HMAC-SHA256 of (join (counter) (command)) with key [test-key])> then
            if <(counter) > (last counter)> then
              set [last counter v] to (counter)
              set [result v] to [accepted]
            end
          end

        when started
          start serial at (115200) baud
          set [last counter v] to (0)
          set [tag v] to (HMAC-SHA256 of (join (1) [OPEN]) with key [test-key])
          accept (1) [OPEN] (tag) :: my
          print (join [fresh command: ] (result))
          accept (1) [OPEN] (tag) :: my
          print (join [same again:    ] (result))
          accept (2) [CLOSE] (tag) :: my
          print (join [altered:       ] (result))
      `,
      cpp: String.raw`
        #include "mbedtls/md.h"

        const uint8_t KEY[] = "test-key-change-me-0123456789abc";   // 32 bytes; in a product: unique per device
        uint32_t lastCounter = 0;                                   // highest counter accepted; keep it in NVS

        // HMAC-SHA-256 over the 4 counter bytes (big-endian) followed by the command text
        void tagOf(uint32_t counter, const char *cmd, uint8_t out[32]) {
          uint8_t msg[4 + 32];
          size_t n = strlen(cmd);
          if (n > 32) n = 32;
          for (int i = 0; i < 4; i++) msg[i] = (counter >> (24 - 8 * i)) & 0xFF;
          memcpy(msg + 4, cmd, n);
          mbedtls_md_hmac(mbedtls_md_info_from_type(MBEDTLS_MD_SHA256), KEY, sizeof(KEY) - 1, msg, 4 + n, out);
        }

        bool sameTag(const uint8_t *a, const uint8_t *b) {          // constant time: never stop at the first difference
          uint8_t diff = 0;
          for (int i = 0; i < 32; i++) diff |= a[i] ^ b[i];
          return diff == 0;
        }

        bool accept(uint32_t counter, const char *cmd, const uint8_t tag[32]) {
          uint8_t expect[32];
          tagOf(counter, cmd, expect);
          if (!sameTag(expect, tag)) return false;                  // forged or altered
          if (counter <= lastCounter) return false;                 // a replay, or an old message
          lastCounter = counter;
          return true;
        }

        void setup() {
          Serial.begin(115200);
          uint8_t tag[32];
          tagOf(1, "OPEN", tag);                                    // what the owner's app would send
          Serial.printf("fresh command: %s\n", accept(1, "OPEN", tag) ? "accepted" : "refused");
          Serial.printf("same again:    %s\n", accept(1, "OPEN", tag) ? "accepted" : "refused");
          Serial.printf("altered:       %s\n", accept(2, "CLOSE", tag) ? "accepted" : "refused");
        }

        void loop() {}
      `,
      py: String.raw`
        import hashlib

        KEY = b"test-key-change-me-0123456789abc"        # 32 bytes; in a product: unique per device
        last_counter = 0                                  # highest counter accepted; keep it in NVS

        def hmac_sha256(key, msg):
            key = key + bytes(64 - len(key))
            inner = hashlib.sha256(bytes(b ^ 0x36 for b in key) + msg).digest()
            return hashlib.sha256(bytes(b ^ 0x5C for b in key) + inner).digest()

        # HMAC-SHA-256 over the 4 counter bytes (big-endian) followed by the command text
        def tag_of(counter, cmd):
            return hmac_sha256(KEY, counter.to_bytes(4, "big") + cmd)

        def same_tag(a, b):                               # constant time: never stop at the first difference
            diff = 0
            for x, y in zip(a, b):
                diff |= x ^ y
            return diff == 0

        def accept(counter, cmd, tag):
            global last_counter
            if not same_tag(tag_of(counter, cmd), tag):
                return False                              # forged or altered
            if counter <= last_counter:
                return False                              # a replay, or an old message
            last_counter = counter
            return True

        tag = tag_of(1, b"OPEN")                          # what the owner's app would send
        print("fresh command:", "accepted" if accept(1, b"OPEN", tag) else "refused")
        print("same again:   ", "accepted" if accept(1, b"OPEN", tag) else "refused")
        print("altered:      ", "accepted" if accept(2, b"CLOSE", tag) else "refused")
      `,
      output: `
        fresh command: accepted
        same again:    refused
        altered:       refused
      `,
      notes: [`Keep the counter in NVS, or a reset lets old recordings work again. To spare the flash, save it every few commands and, after a boot, start from the saved value plus that margin.`, `Do not invent your own cipher: HMAC and AES-GCM from mbedTLS, or hashlib in MicroPython, are the tools. The MicroPython HMAC here is written out by hand for the 32-byte key of the example.`]
    }
  ],
  quiz: [
    { q: `A lock accepts the command OPEN from any paired phone, and pairing uses Just Works. What is wrong?`, choices: [`Nothing: the link is encrypted`, `Anyone nearby can pair, so being paired proves nothing about being the owner`, `Just Works cannot encrypt`, `OPEN is too short a command`], a: 1, why: `Just Works encrypts the link but accepts whoever asks. Without a signature of its own, the lock cannot tell the owner from a stranger.` },
    { q: `A command carries a valid HMAC tag but no counter. What attack still works?`, choices: [`Changing OPEN to CLOSE`, `Recording the message and sending it again later`, `Guessing the key from the tag`, `None`], a: 1, why: `The tag stops anyone from making or altering a command, but a recording of a valid message still verifies. A counter or a fresh challenge makes each message good once only.` },
    { q: `Putting the sensor reading in the advertising packet keeps it private because only the app knows where to look.`, a: false, why: `Advertising packets are received by every device in range, and anyone can read the manufacturer data. Anything private belongs behind an authenticated connection.` },
    { q: `After a reset the device forgets the last accepted counter and restarts at zero. What follows?`, choices: [`Nothing`, `Every old recorded command becomes valid again`, `The key is lost`, `The tag becomes shorter`], a: 1, why: `The replay check depends on the stored counter. Keep it in non-volatile memory, with a margin for the commands not yet saved.` }
  ],
  applications: [
    `Bluetooth door locks, bike locks and padlocks, where a recorded command must not open them.`,
    `Medical and fitness devices that expose readings only to a bonded phone.`,
    `Configuration over Bluetooth, such as Wi-Fi credentials, behind an authenticated characteristic ([[wifi-provisioning]]).`,
    `Beacons and tags, where the aim is privacy of the address rather than secrecy of the content.`
  ],
  sources: [
    `Bluetooth SIG, *Bluetooth Core Specification*, Security Manager Protocol and the sections on LE Secure Connections and privacy.`,
    `IETF RFC 2104, *HMAC: Keyed-Hashing for Message Authentication*.`,
    `Arduino core for ESP32 documentation, the *BLE* library and its examples (core 3.3).`
  ],
  sim: 'cs-replay'
}
,

/* ================================================================ a safe web interface */
{
  id: 'web-interface-security',
  parent: 'connection-security',
  title: 'A safe web interface',
  level: 2,
  short: `A web page on an ESP is convenient and it is also a door. A login with no default password, actions that are POST requests, escaped output, checked input, and nothing exposed to the internet.`,
  keywords: ['web server security', 'authentication', 'HTTP Basic', 'CSRF', 'cross-site request forgery', 'XSS', 'cross-site scripting', 'escape', 'default password', 'POST', 'reverse proxy', 'HTTPS server', 'CORS', 'WebServer', 'authenticate', 'requestAuthentication', 'port forwarding'],
  prereq: ['web-server-on-esp', 'credentials-handling'],
  related: ['wifi-network-security', 'soft-ap-and-captive-portal', 'websockets', 'secure-ota', 'tls-on-esp', 'web-ui-as-a-display', 'mqtt'],
  body: `A web page on an ESP is convenient and it is also a door. Anyone who can reach its port can try it: a visitor on your Wi-Fi, a stranger if the device is exposed to the internet, and even a web page open in *your* browser, which can quietly send requests to devices on your own network.

### Eight rules

1. **A login, and no default password.** A password per unit ([[credentials-handling]]); refuse to start with a placeholder; slow down after failed tries. Never leave an unauthenticated "temporary" set-up or update page.
2. **Know where the password travels.** HTTP Basic sends it with every request, only disguised, so on plain HTTP anyone on the path reads it. HTTPS on the ESP is possible (ESP-IDF has an HTTPS server) but costs RAM and needs a certificate that a browser accepts, which a device with no public name rarely has. The practical middle: keep the page on a trusted segment ([[wifi-network-security]]), put a reverse proxy with a real certificate in front of it, or let the device only call out over TLS ([[mqtt]]) and show the dashboard elsewhere.
3. **Actions are POST, never GET.** A browser fetches any address a page tells it to, so a hidden image pointing at the relay's "on" address, on any page you visit, switches your relay. That is *cross-site request forgery*. Use POST, put a token in your own page that the server checks, check the Origin header, and do the same for WebSocket connections.
4. **Escape what you print.** Network names from a scan, device names, MQTT payloads and form input can contain HTML. A network named with a script tag becomes code in your page unless \`<\`, \`>\`, \`&\` and quotes are escaped: *cross-site scripting*.
5. **Limit and validate.** Bound the size of every body, check each value (a number from 0 to 100, one of "0" and "1"), refuse unknown paths, serve static files only from a fixed folder (core 3.3.12 refuses \`..\` in paths), and never ship a file manager or an editor in a product.
6. **Do not leak.** Never print a stored password into the settings page (an empty field can mean "unchanged"), and send no \`Access-Control-Allow-Origin: *\` from endpoints that act.
7. **Do not expose it.** No port forwarding: the internet is scanned all day, and the first thing tried is the default login.
8. **Protect the update door.** An update page is the most powerful of all: authenticate it, and check the signature of what it receives ([[secure-ota]]).

> [!key] Put a per-unit login on every page that acts, make actions POST requests with a token, escape everything you print, check every input, keep the page off the internet, and treat the update page as the most dangerous one.`,
  ideas: [
    `Anyone who can reach the port can try the page, and so can a web page open in your own browser.`,
    `A per-unit password, no default, and a refusal to start with a placeholder are the minimum for a login.`,
    `Actions must be POST requests with a token: a GET that changes something can be triggered from any web page.`,
    `Escape every value you print, check every value you accept, and keep the interface off the internet.`
  ],
  pitfalls: [
    `HTTP Basic hides the password because it is encoded — Basic authentication is Base64, a disguise and not encryption. On plain HTTP anyone on the path can read it, so use it only on a trusted segment or over TLS.`,
    `The page is only on my home network, so it needs no login — A guest, an infected laptop or a web page in your own browser can all reach it. Add a login and use POST for actions.`,
    `A link in my page that switches the relay is the simplest design — It is the one that can be triggered from any web page you visit. Make it a POST with a token.`
  ],
  terms: [
    { term: `Cross-site request forgery`, also: [`CSRF`, `XSRF`], def: `Making a user's browser send a request to a device or site the user can reach, from a different web page. A GET address that changes something can be triggered this way; POST with a token cannot.` },
    { term: `Cross-site scripting`, also: [`XSS`], def: `Getting a page to run attacker-supplied script because the page printed untrusted text, such as a network name, without escaping it.` },
    { term: `HTTP Basic authentication`, also: [`Basic auth`, `Authorization header`], def: `A login in which the browser sends the user name and password, Base64-encoded, with every request. It is readable on plain HTTP and safe only inside TLS or on a trusted segment.` },
    { term: `Reverse proxy`, also: [`TLS terminator`], def: `A server in front of a device that handles HTTPS with a real certificate, checks the login and forwards requests to the device over the trusted network.` },
    { term: `HTML escaping`, also: [`escaping`, `sanitising`], def: `Replacing the characters that mean something in HTML (<, >, &, quotes) with harmless codes before printing untrusted text into a page.` }
  ],
  choose: {
    good: [`A per-unit password, checked on every request`, `POST for every action, with a token the page carries`, `A reverse proxy with a real certificate in front of a local page`],
    avoid: [`A default password, or a page that starts with a placeholder one`, `GET requests that change the state of the device`, `A forwarded port, or an update page without a login`],
    check: [`What a request without a login receives, from every path`, `What happens when a network name or a message contains angle brackets`, `That no page shows a stored password`]
  },
  code: [
    {
      title: `A page with a login, where actions are POST requests`,
      about: `Serves a page with two buttons that switch the LED. Every request needs the login, the buttons send POST, anything but "0" or "1" is refused, and the program will not start while the password is still the placeholder.`,
      needs: `An ESP32 DevKit with an LED on GPIO2, and a Wi-Fi network. Set a password of your own before running: the program stops at the placeholder. In a product the password would be the per-unit code of [[credentials-handling]].`,
      wiring: [[`GPIO2`, `the on-board LED`, `or: GPIO2 → 220 Ω → LED → GND`]],
      blocks: `
        when started
          if <(password) = [change-me]> then
            print [set a password first]
            stop [this script v]
          end
          set pin (2) as [output v]
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          start web server on port (80)

        when request for [/] arrives
          if <login is valid :: security> then
            send the page with an on button and an off button
          else
            ask the browser for a login :: security
          end

        when POST request for [/led] arrives
          if <not <login is valid :: security>> then
            ask the browser for a login :: security
          else if <<(value of [state]) = [1]> or <(value of [state]) = [0]>> then
            set pin (2) to (value of [state])
            send the page again
          else
            send error [400] :: net
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <WebServer.h>

        const char *USER = "admin";
        const char *PASS = "change-me";                  // set your own: the program refuses to run with this one
        const int LED = 2;
        WebServer server(80);

        bool allowed() {
          if (server.authenticate(USER, PASS)) return true;
          server.requestAuthentication();               // asks the browser for the login
          return false;
        }

        void handleRoot() {
          if (!allowed()) return;
          server.send(200, "text/html",
            "<form method='POST' action='/led'>"
            "<button name='state' value='1'>on</button> "
            "<button name='state' value='0'>off</button></form>");
        }

        void handleLed() {                              // changes something: POST only, login required
          if (!allowed()) return;
          String s = server.arg("state");
          if (s != "0" && s != "1") {                   // check the input
            server.send(400, "text/plain", "bad value");
            return;
          }
          digitalWrite(LED, s == "1");
          server.sendHeader("Location", "/");
          server.send(303, "text/plain", "");
        }

        void setup() {
          Serial.begin(115200);
          if (strcmp(PASS, "change-me") == 0) {
            Serial.println("set a password first");
            while (true) delay(1000);
          }
          pinMode(LED, OUTPUT);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);
          server.on("/", HTTP_GET, handleRoot);
          server.on("/led", HTTP_POST, handleLed);      // a GET to /led finds nothing: 404
          server.begin();
          Serial.println(WiFi.localIP());
        }

        void loop() {
          server.handleClient();
        }
      `,
      py: String.raw`
        import socket, network, time, binascii
        from machine import Pin

        USER, PASS = "admin", "change-me"                # set your own: the program refuses to run with this one
        if PASS == "change-me":
            raise SystemExit("set a password first")

        led = Pin(2, Pin.OUT)
        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)

        EXPECTED = b"Basic " + binascii.b2a_base64((USER + ":" + PASS).encode()).strip()   # what a correct login sends
        PAGE = (b"<form method='POST' action='/led'><button name='state' value='1'>on</button> "
                b"<button name='state' value='0'>off</button></form>")

        def same(a, b):                                  # constant time: never stop at the first difference
            if len(a) != len(b):
                return False
            diff = 0
            for x, y in zip(a, b):
                diff |= x ^ y
            return diff == 0

        def reply(cl, status, body=b"", extra=b""):
            cl.send(b"HTTP/1.0 " + status + b"\r\n" + extra + b"Content-Length: " + str(len(body)).encode() + b"\r\n\r\n" + body)

        srv = socket.socket()
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind(("0.0.0.0", 80))
        srv.listen(2)
        print(wlan.ipconfig("addr4"))
        while True:
            cl, addr = srv.accept()
            cl.settimeout(3)
            try:
                req = cl.recv(1024)
                head, _, body = req.partition(b"\r\n\r\n")
                lines = head.split(b"\r\n")
                method, path = lines[0].split(b" ")[:2]
                auth = b""
                for line in lines[1:]:
                    if line.lower().startswith(b"authorization:"):
                        auth = line.split(b":", 1)[1].strip()
                if not same(auth, EXPECTED):
                    reply(cl, b"401 Unauthorized", extra=b'WWW-Authenticate: Basic realm="device"\r\n')
                elif method == b"GET" and path == b"/":
                    reply(cl, b"200 OK", PAGE, b"Content-Type: text/html\r\n")
                elif method == b"POST" and path == b"/led" and body in (b"state=1", b"state=0"):
                    led.value(1 if body == b"state=1" else 0)
                    reply(cl, b"303 See Other", extra=b"Location: /\r\n")
                else:
                    reply(cl, b"404 Not Found")
            except (OSError, ValueError):
                pass
            finally:
                cl.close()
      `,
      output: `
        192.168.1.57
      `,
      notes: [`HTTP Basic is sent in a form anyone on the path can decode: use this on a trusted segment, or behind a reverse proxy that adds TLS.`, `The MicroPython server is a teaching version: it assumes the small form arrives in one piece and serves one client at a time.`, `A GET to /led gets a 404 in both versions: the only way to change the LED is a POST that carries the login. A token in the page, checked by the server, would also stop a forged POST from a page the browser has remembered the login for.`]
    }
  ],
  quiz: [
    { q: `Your relay switches with an address such as /relay?on=1. A friend sends you a web page with a hidden image pointing at that address, and you open it on your home Wi-Fi. What happens?`, choices: [`Nothing: the page belongs to another site`, `Your browser fetches the address and the relay switches`, `The router blocks it`, `The relay switches only if you are on the device's own page`], a: 1, why: `Browsers fetch whatever address a page names, from your network position. A state-changing GET can therefore be triggered from any page. POST with a token, checked by the server, prevents it.` },
    { q: `A page lists nearby Wi-Fi networks so the user can pick one, and one network is named with a script tag. What should the ESP do?`, choices: [`Nothing: network names are harmless`, `Escape the name before putting it into the page`, `Refuse to scan`, `Sort the list`], a: 1, why: `Unescaped, the name becomes code in your page (cross-site scripting). Replacing <, >, & and quotes with their HTML codes shows the text as text.` },
    { q: `HTTP Basic authentication over plain HTTP keeps the password secret, because it is encoded.`, a: false, why: `Base64 is an encoding, not encryption. Anyone who can see the traffic decodes it at once. Use Basic only on a trusted segment or inside TLS.` },
    { q: `What best stops a device from running with a factory password?`, choices: [`Printing it clearly in the manual`, `A unique password per unit, and a program that refuses to start with a placeholder`, `A longer default password`, `Hiding the login page`], a: 1, why: `A password that is the same in every unit is known to everyone. A per-unit one, and a refusal to run with the placeholder, remove the default altogether.` }
  ],
  applications: [
    `A configuration page on a smart plug, thermostat or sensor.`,
    `A control page on a hobby robot or a 3D-printer controller kept on the home network.`,
    `A captive portal that lists networks and takes the Wi-Fi password ([[soft-ap-and-captive-portal]]).`,
    `Update pages of devices that are updated from a browser ([[secure-ota]]).`
  ],
  sources: [
    `Arduino core for ESP32 documentation, the *WebServer* library, and the 3.3.12 migration note on its hardening.`,
    `IETF RFC 7617, *The 'Basic' HTTP Authentication Scheme*.`,
    `OWASP, *Top Ten* and the *Cross-Site Request Forgery Prevention Cheat Sheet*.`
  ]
}
,

/* ================================================================ the rules */
{
  id: 'regulations-cra-and-red',
  parent: 'connection-security',
  title: 'The rules: the EU Cyber Resilience Act, RED and labels',
  level: 2,
  short: `In several markets the security of a connected product is now a legal duty of its maker. The EU Radio Equipment Directive and Cyber Resilience Act, the UK product security regime and the US labels, in outline, as of October 2026, and what they mean for a product built on an ESP.`,
  keywords: ['Cyber Resilience Act', 'CRA', 'RED', 'Radio Equipment Directive', 'EN 18031', 'PSTI', 'Cyber Trust Mark', 'ETSI EN 303 645', 'NIST IR 8259', 'CE marking', 'support period', 'SBOM', 'default passwords', 'vulnerability reporting', 'California SB-327', 'compliance'],
  prereq: ['iot-threat-model', 'regulatory-approval'],
  related: ['vulnerabilities-and-updates', 'security-checklist', 'credentials-handling', 'module-certification', 'secure-ota', 'privacy-and-data-protection'],
  body: `Connected products are no longer a free-for-all: in several markets the security of a connected product is now a legal duty of its maker. This page names the main rules **as of October 2026, in outline and without legal advice**. Check every date and requirement against the current text before relying on it.

### The main regimes

| Where | Rule | In outline | When |
|---|---|---|---|
| EU | Radio Equipment Directive, delegated act 2022/30 | internet-connected radio equipment must protect networks, personal data and users against fraud; shown through the harmonised standards EN 18031 | applies from 1 August 2025 |
| EU | Cyber Resilience Act (Regulation 2024/2847) | security across the product's life: secure by default, no known exploitable flaw at release, security updates for a support period, vulnerability handling and reporting, a list of components | in force since December 2024; reporting duties from September 2026; main duties from December 2027 |
| UK | Product security regime (PSTI Act 2022 and its 2023 regulations) | no universal default passwords; a published way to report vulnerabilities; a stated minimum period of security updates | in force since April 2024 |
| US | Cyber Trust Mark, a voluntary label; some state laws, California's among them | the label builds on NIST criteria; California asks for reasonable security, such as a unique password per device or a forced change at first use | voluntary, or state by state: check the current status |

Behind them stand the same few ideas, written down in ETSI EN 303 645 for consumer IoT and in the NIST IR 8259 series.

### What it means for a product built on an ESP

- **A certified radio module covers the radio rules, not the security of your product.** You are the manufacturer ([[module-certification]], [[regulatory-approval]]).
- **One set of measures answers them all:** a unique credential per device and no default password, secure boot and flash encryption where the risk calls for them, signed updates, verified TLS, as few open ports as possible, a contact for vulnerability reports and a stated support period. The checklist below scores these.
- **Updates are a long commitment.** Five years of fixes means keeping the build environment, the signing key and a supported ESP-IDF branch that long ([[vulnerabilities-and-updates]]).
- **A one-off for yourself is not "placing a product on the market"; selling one in the course of business is.** For where the line lies, ask your national authority or a conformity assessor.
- **The chip maker helps but does not certify your product.** Espressif documents the security features of its chips and SDK; assessing the finished product is yours.

> [!key] The law now asks of a connected product what good practice always did: no default passwords, protected connections, signed updates for a stated period, and a way to report flaws. A certified module does not carry these for you, and every date here should be checked before you rely on it.`,
  ideas: [
    `The EU Radio Equipment Directive's cybersecurity duties apply since August 2025, and the Cyber Resilience Act's main duties follow in December 2027, with reporting from September 2026.`,
    `The UK regime asks three things: no universal default passwords, a published contact for vulnerability reports, and a stated period of security updates.`,
    `A certified radio module does not make the product compliant: the maker of the finished product carries the security duties.`,
    `The same measures answer every regime; the checklist turns them into questions.`
  ],
  pitfalls: [
    `I use a certified module, so the product is compliant — The module's certificate covers the radio. The security of the product around it, its updates and its password handling are the maker's duty.`,
    `The rules apply only to big companies — They apply to the maker of a product put on the market, however small. A one-off for yourself is outside; a product you sell is not.`,
    `Once the product is out of the shop, the duty to fix flaws ends — The duty runs for the support period the maker states, normally at least five years under the Cyber Resilience Act, whether or not the product is still on sale. Check the current text.`
  ],
  terms: [
    { term: `Radio Equipment Directive`, also: [`RED`, `2014/53/EU`, `delegated act 2022/30`], def: `The EU law for radio equipment. A delegated act adds cybersecurity, privacy and fraud-protection requirements for internet-connected radio equipment, applying from August 2025.` },
    { term: `Cyber Resilience Act`, also: [`CRA`, `Regulation 2024/2847`], def: `The EU regulation that sets cybersecurity requirements for products with digital elements across their life: secure by default, fixed vulnerabilities, security updates for a support period, and reporting.` },
    { term: `EN 18031`, also: [`EN 18031-1`, `harmonised standard`], def: `A European standard in several parts, used to show that radio equipment meets the Radio Equipment Directive's cybersecurity requirements, organised around mechanisms such as access control, authentication, secure update and secure storage.` },
    { term: `PSTI`, also: [`Product Security and Telecommunications Infrastructure`, `UK product security regime`], def: `The UK law, in force since April 2024, that bans universal default passwords and requires a published vulnerability contact and a stated period of security updates.` },
    { term: `Cyber Trust Mark`, also: [`US Cyber Trust Mark`], def: `A voluntary US label for connected consumer products that meet security criteria based on NIST guidance. Its administration and status have been changing: check the current state.` },
    { term: `Support period`, also: [`update period`, `end of support`], def: `The time during which a maker promises to fix security flaws in a product. Several laws require it to be stated and, in the EU, to be normally at least five years.` }
  ],
  choose: {
    good: [`Designing to the common measures from the start: unique credentials, signed updates, verified TLS`, `Stating the support period and the vulnerability contact before the first sale`, `Asking a conformity assessor early about the product's class`],
    avoid: [`Assuming the module's certificate covers the product`, `Copying a date or an obligation from a blog post instead of the text of the law`, `Promising an update period you cannot keep`],
    check: [`Which markets you sell in, and the current text for each`, `Whether your product counts as one that is put on the market`, `That the support period fits your ESP-IDF branch and your signing key`]
  },
  quiz: [
    { q: `A team puts a certified ESP32 module into a smart plug sold in the EU. Which statement is right?`, choices: [`The module's certificate covers the plug's cybersecurity duties`, `The module's radio certification does not cover the security duties of the finished product`, `No security rules apply to plugs`, `Only the module's maker is responsible`], a: 1, why: `Module certification covers the radio. The company that puts the finished product on the market carries the duties for its security, updates and password handling.` },
    { q: `Which three things does the UK product security regime ask of a manufacturer?`, choices: [`A CE mark, EN 18031 and a secure element`, `No universal default passwords, a published contact for vulnerability reports, and a stated period of security updates`, `Open-source firmware, a VPN and a hidden SSID`, `A hardware token, a firewall and a licence`], a: 1, why: `These are the three requirements of the UK regulations in force since April 2024.` },
    { q: `Once a product is no longer on sale, its maker's duty to fix security flaws ends.`, a: false, why: `The duty runs for the support period the maker has stated, which in the EU is normally at least five years, whether or not the product is still sold. Check the current text for your case.` },
    { q: `Which one measure helps with the aims of the Radio Equipment Directive, the Cyber Resilience Act and the UK regime alike?`, choices: [`A unique credential per device and no default password`, `A longer network name`, `A hidden web page`, `More RAM`], a: 0, why: `Default and shared passwords are named in the UK law, are covered by the access-control and authentication requirements of the EU rules, and are the oldest fault of connected products.` }
  ],
  applications: [
    `A company preparing a smart plug or sensor for the European and British markets.`,
    `A start-up deciding what security to build in before its first batch.`,
    `A maker who wants to sell a small run of a board and needs to know where the line between hobby and product lies.`,
    `A buyer or integrator asking a supplier for its support period and its vulnerability contact.`
  ],
  sources: [
    `Regulation (EU) 2024/2847, the *Cyber Resilience Act*, and Commission Delegated Regulation (EU) 2022/30 under the Radio Equipment Directive 2014/53/EU.`,
    `The UK Product Security and Telecommunications Infrastructure Act 2022 and the Security Requirements for Relevant Connectable Products Regulations 2023.`,
    `ETSI EN 303 645, *Cyber Security for Consumer Internet of Things: Baseline Requirements*, and NIST IR 8259A.`
  ],
  sim: { id: 'cs-checklist', params: { set: 'rules' } }
},

/* ================================================================ vulnerabilities, advisories, updates */
{
  id: 'vulnerabilities-and-updates',
  parent: 'connection-security',
  title: 'Vulnerabilities, advisories and updates',
  level: 2,
  short: `Flaws will be found in your code and in everything it stands on. Where they come from, how to read an advisory, what a maker must do — know, watch, be reachable, fix, say how long — and why the update path is itself a door that needs a lock.`,
  keywords: ['vulnerability', 'CVE', 'CVSS', 'advisory', 'security advisory', 'SBOM', 'coordinated disclosure', 'PSIRT', 'patch', 'support period', 'end of support', 'ESP-IDF release', 'mbedTLS', 'KRACK', 'staged rollout', 'minimum safe version'],
  prereq: ['ota-updates', 'secure-ota'],
  related: ['ota-partitions-and-rollback', 'ota-from-a-server', 'regulations-cra-and-red', 'security-checklist', 'wifi-network-security', 'toolchains-and-setup', 'certificates-and-root-cas'],
  body: `Flaws will be found: in your code and in everything it stands on. What separates a safe product from an unsafe one is whether its maker finds out, and whether the device can be fixed in the field.

### Where flaws come from

Your own code; the SDK under it (ESP-IDF, lwIP, mbedTLS, the Wi-Fi and Bluetooth stacks); the libraries you add; and the protocols themselves. The KRACK flaw of 2017 was a flaw in the *design* of the WPA2 handshake: the cure was an update, and devices that never received one stayed open. The Arduino core 3.3 is built on ESP-IDF 5.5, so a sketch's security fixes are those of that ESP-IDF branch ([[toolchains-and-setup]]).

### How a flaw reaches you

A flaw gets a **CVE** number and often a **CVSS** score from 0 to 10. Espressif and the authors of libraries publish **advisories** listing the affected versions and the fix. The score is a start, not a verdict: read the conditions. Is it reachable over the network, or only locally? Does it need a login, a nearby radio or physical access? Is the vulnerable feature even in your build? A 9.8 in code you do not use matters less than a 6 in the port you expose.

### What the maker does

1. **Know what is inside.** Keep a list of components and versions (an SBOM) for every release.
2. **Watch.** Follow the advisories for your SDK branch and libraries, and check that the branch is still supported: support periods are finite (check Espressif's current policy).
3. **Be reachable.** Publish a contact for reports and a short policy: acknowledge, assess, fix, credit. Several laws now ask for it ([[regulations-cra-and-red]]).
4. **Fix and ship.** A signed update, a staged roll-out, an automatic rollback if the new image does not start ([[secure-ota]], [[ota-partitions-and-rollback]], [[ota-from-a-server]]).
5. **Say how long.** Announce the end of support in advance, and ship a last release that closes what can be closed.

### The update is a door too

The update path can replace the whole firmware, so it needs a verified signature, a verified TLS connection to the server and protection against rolling back to an old, flawed image. A device that cannot be updated should sit on a network of its own ([[wifi-network-security]]) and be replaced.

> [!key] Expect flaws, know which components you ship, watch the advisories that concern them, give reporters a way in and give devices a signed, rollback-safe way to receive the fix. State the support period, and isolate whatever cannot be updated.`,
  ideas: [
    `Flaws come from your code, the SDK, the libraries and the protocols, so a product needs a list of what it contains.`,
    `A CVSS score is a starting point: whether the feature is in your build, and how it can be reached, decide the real urgency.`,
    `A maker must know, watch, be reachable, fix and say how long the fixes will come.`,
    `The update path is a door: sign the updates, verify the server, and block rollback to old images.`
  ],
  pitfalls: [
    `We use Arduino, so the SDK's flaws are not our concern — The core is built on ESP-IDF, and its flaws and fixes travel with it. Keep the core up to date or know which fixes you lack.`,
    `A high CVSS score always means patch at once — The score ignores your build. A feature you do not compile in cannot be attacked; a lower score in your open port can matter more. Check, then decide.`,
    `Signing updates is enough — A signed old image is still signed. Without rollback protection an attacker can install a signed, flawed version.`
  ],
  terms: [
    { term: `CVE`, also: [`Common Vulnerabilities and Exposures`, `CVE number`], def: `A public identifier, such as CVE-2025-12345, given to one known vulnerability so that advisories, tools and users all talk about the same flaw.` },
    { term: `CVSS`, also: [`Common Vulnerability Scoring System`, `severity score`], def: `A 0 to 10 score of how serious a vulnerability is, from how it can be reached and what it allows. It does not know whether the flaw is in your build.` },
    { term: `Security advisory`, also: [`advisory`, `security bulletin`], def: `A published notice about a vulnerability: what it is, which versions are affected and how to fix it. Espressif and the authors of libraries issue them.` },
    { term: `SBOM`, also: [`software bill of materials`, `component list`], def: `A machine-readable list of the components and versions in a firmware release, used to find out quickly which products an advisory concerns.` },
    { term: `Coordinated vulnerability disclosure`, also: [`responsible disclosure`, `CVD`, `vulnerability contact`], def: `An agreed way for someone who finds a flaw to tell the maker privately, give time to fix it, and then publish. The maker needs a contact and a policy for it.` },
    { term: `End of support`, also: [`end of life`, `EOL`], def: `The date after which a maker no longer promises security fixes for a product or an SDK version. Announced in advance, it lets owners plan a replacement.` }
  ],
  choose: {
    good: [`A signed, staged update with automatic rollback`, `An SBOM generated at every build`, `A published contact and a stated support period`],
    avoid: [`Shipping with no way to update in the field`, `Unpinned libraries that change between builds`, `Telling nobody when support ends`],
    check: [`Which ESP-IDF branch your build uses, and whether it still gets security fixes`, `That an old signed image cannot be installed again`, `Who reads the security mailbox, and how fast they answer`]
  },
  code: [
    {
      title: `Check the version, and refuse to run unsafe features on an old one`,
      about: `Asks your server, over a verified TLS connection, for the newest version and the oldest still safe one, then decides: up to date, update available, or update now. The update itself is the subject of the update pages.`,
      needs: `An ESP32-family board with Wi-Fi and a server that serves a small JSON file such as {"version": 13, "min_safe": 11}. Paste the PEM text of the root of the server's chain (MicroPython: save it as root_ca.der).`,
      libs: [`ArduinoJson`],
      blocks: `
        when started
          set [current v] to (12)
          start serial at (115200) baud
          connect to Wi-Fi [your-ssid] password [your-password]
          wait until <Wi-Fi connected?>
          sync the clock with [pool.ntp.org] :: net
          trust the root certificate [root_ca] :: security
          set [info v] to (https get json [https://example.com/firmware/latest.json])
          if <(current) < (value [min_safe] of (info))> then
            print [this version has a known security fault: update now]
          else if <(current) < (value [version] of (info))> then
            print [an update is available]
          else
            print [up to date]
          end
      `,
      cpp: String.raw`
        #include <WiFi.h>
        #include <time.h>
        #include <NetworkClientSecure.h>
        #include <HTTPClient.h>
        #include <ArduinoJson.h>

        const int CURRENT_VERSION = 12;                  // raise it with every release
        const char *LATEST_URL = "https://example.com/firmware/latest.json";   // {"version": 13, "min_safe": 11}

        const char ROOT_CA[] =
          "-----BEGIN CERTIFICATE-----\n"
          "paste the root certificate of your server's chain here, one quoted line per row\n"
          "-----END CERTIFICATE-----\n";

        void setup() {
          Serial.begin(115200);
          WiFi.begin("your-ssid", "your-password");
          while (WiFi.status() != WL_CONNECTED) delay(250);

          configTime(0, 0, "pool.ntp.org");              // certificates have dates: the clock first
          struct tm t;
          if (!getLocalTime(&t, 10000)) {
            Serial.println("no time, so no check");
            return;
          }

          NetworkClientSecure client;
          client.setCACert(ROOT_CA);                     // verify the server
          HTTPClient http;
          if (!http.begin(client, LATEST_URL)) return;
          int code = http.GET();
          if (code == HTTP_CODE_OK) {
            JsonDocument doc;
            if (!deserializeJson(doc, http.getString())) {
              int latest = doc["version"] | 0;
              int minSafe = doc["min_safe"] | 0;
              if (CURRENT_VERSION < minSafe) Serial.println("this version has a known security fault: update now");
              else if (CURRENT_VERSION < latest) Serial.println("an update is available");
              else Serial.println("up to date");
            }
          } else {
            Serial.println(code > 0 ? String(code) : http.errorToString(code));
          }
          http.end();
        }

        void loop() {}
      `,
      py: String.raw`
        import network, ntptime, socket, ssl, json, time

        CURRENT_VERSION = 12                             # raise it with every release
        HOST, PATH = "example.com", "/firmware/latest.json"     # {"version": 13, "min_safe": 11}

        wlan = network.WLAN(network.WLAN.IF_STA)
        wlan.active(True)
        wlan.connect("your-ssid", "your-password")
        while not wlan.isconnected():
            time.sleep_ms(250)
        ntptime.settime()                                # certificates have dates: the clock first

        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ctx.verify_mode = ssl.CERT_REQUIRED              # verify the server
        ctx.load_verify_locations(cadata=open("root_ca.der", "rb").read())

        try:
            s = socket.socket()
            s.connect(socket.getaddrinfo(HOST, 443)[0][-1])
            s = ctx.wrap_socket(s, server_hostname=HOST)
            s.write(("GET %s HTTP/1.0\r\nHost: %s\r\n\r\n" % (PATH, HOST)).encode())
            data = b""
            while True:
                chunk = s.read(512)
                if not chunk:
                    break
                data += chunk
            s.close()
            info = json.loads(data.split(b"\r\n\r\n", 1)[1])
            if CURRENT_VERSION < info.get("min_safe", 0):
                print("this version has a known security fault: update now")
            elif CURRENT_VERSION < info.get("version", 0):
                print("an update is available")
            else:
                print("up to date")
        except (OSError, ValueError, IndexError) as e:
            print("check failed:", e)
      `,
      output: `
        an update is available
      `,
      notes: [`Publish min_safe whenever a flaw is fixed: a device below it can switch off the risky feature at once and keep only what is safe, before the update has arrived.`, `Do not let this check be the only protection: the update that follows must be signed and rollback-protected ([[secure-ota]]).`, `If the check fails (no time, no network, a wrong certificate), the device keeps running as it is; it never loosens the certificate check to get an answer.`]
    }
  ],
  quiz: [
    { q: `An advisory rates a flaw in a Bluetooth feature at CVSS 9.8, and your product is built without Bluetooth. What does the score tell you?`, choices: [`Patch immediately, whatever the build`, `It is a start: a feature that is not in the build cannot be attacked, but check it and note why you are not affected`, `Ignore all advisories`, `Switch off Wi-Fi`], a: 1, why: `CVSS rates the flaw in general, not in your build. Whether it applies to you depends on what you compiled in and how it can be reached; verify and record the decision.` },
    { q: `Why does a product need a published contact for vulnerability reports?`, choices: [`To advertise the product`, `So that someone who finds a flaw can tell the maker privately and in time, and several laws now require it`, `To collect customer feedback`, `To sell support contracts`], a: 1, why: `Without a known contact, a finder has nowhere to go but publication. A contact and a short policy make coordinated disclosure possible.` },
    { q: `If updates are signed, protection against rolling back to an older image is not needed.`, a: false, why: `An old, flawed image is still correctly signed. Without anti-rollback an attacker can install it and use its flaw.` },
    { q: `What is an SBOM for?`, choices: [`Making the firmware smaller`, `Finding out at once which of your products an advisory about a component concerns`, `Signing updates`, `Counting users`], a: 1, why: `A list of components and versions per release lets you match an advisory to the products that contain the faulty part without searching the source.` }
  ],
  applications: [
    `A maker deciding the support period for a smart plug and the way to announce its end.`,
    `A team that watches Espressif's advisories for the ESP-IDF branch its product uses.`,
    `A hobbyist with a dozen ESP boards at home who keeps them updated and on their own network ([[wifi-network-security]]).`,
    `A product that publishes a minimum safe version and disables risky features below it.`
  ],
  sources: [
    `Espressif, the *Security Advisories* pages and the *ESP-IDF Programming Guide* "Release and Support Policy" (check the current policy).`,
    `FIRST, *Common Vulnerability Scoring System* specification, and the CVE Program documentation.`,
    `ISO/IEC 29147, *Vulnerability disclosure*, and ISO/IEC 30111, *Vulnerability handling processes*.`
  ]
},

/* ================================================================ a security checklist */
{
  id: 'security-checklist',
  parent: 'connection-security',
  title: 'A security checklist',
  level: 1,
  short: `Ten questions to put to every connected design: secrets, connections, identity, set-up, network, interfaces, the device itself, updates, process and data. A checklist does not make a device secure, but it finds what was forgotten, and a score shows what to fix first.`,
  keywords: ['security checklist', 'review', 'attack surface', 'defence in depth', 'secure by default', 'critical gap', 'design review', 'score', 'IoT security baseline', 'before you ship', 'audit'],
  prereq: ['credentials-handling', 'tls-on-esp', 'secure-provisioning'],
  related: ['iot-threat-model', 'regulations-cra-and-red', 'vulnerabilities-and-updates', 'wifi-network-security', 'web-interface-security', 'ble-security-practice', 'choosing-a-chip'],
  body: `A checklist does not make a device secure, but it finds what you forgot, and it makes the review of someone else's design quick. Use it at three moments: when you design, before you ship, and once a year afterwards.

### Ten questions for every connected device

| Area | Ask |
|---|---|
| Secrets | Is any password, key or token in source code or in the shared firmware? Does every unit have its own? |
| Connections | Is every TLS connection verified, with no setInsecure and no CERT_NONE? Is the clock set first, and does the device stop when a check fails? |
| Identity | Does the device prove who it is with a per-device certificate or key, not a shared password? |
| Set-up | Does set-up need a physical act, a per-unit secret and a time limit? Can the user start again? |
| Network | Is the device on a segment of its own, with no port forwarded to it? |
| Interfaces | Does every page, characteristic and command that acts need a login or an authenticated link, and are commands signed? |
| The device | Are secure boot and flash encryption on in the product, and the debug ports closed ([[secure-boot]], [[flash-encryption]], [[disabling-debug-interfaces]])? |
| Updates | Are updates signed, rollback-protected and fetched over a verified connection? |
| Process | Is there a support period, a contact for reports and a list of components? |
| Data | Does the device collect only what it needs, and can the owner delete it ([[privacy-and-data-protection]])? |

### How to read the score

Not every gap weighs the same. Some are **critical**: a compiled-in password, a connection that does not verify, a shared secret in every unit, an unsigned update path, an action with no login. One of them caps the score whatever else is right, because an attacker needs only one open door. The rest are weighted by how much they reduce the damage and how likely they are to be used. The score compares designs and shows what to fix first; it is not a certificate.

### Be honest about the hardware

Some measures depend on the chip: by the catalogue the original ESP32, the ESP32-C2 and the ESP8266 have no Digital Signature peripheral, and the ESP8266 has no secure boot or flash encryption at all. Pick the chip with the product's risk in mind ([[choosing-a-chip]]).

> [!key] Ask the same ten questions of every design: secrets, connections, identity, set-up, network, interfaces, the device itself, updates, process and data. Fix the critical gaps first: a good score elsewhere does not make up for an open door.`,
  ideas: [
    `The same ten areas apply to every connected device: secrets, connections, identity, set-up, network, interfaces, the device, updates, process and data.`,
    `Some gaps are critical, and one of them is enough to let an attacker in, so they cap the score.`,
    `The score is for comparing designs and ordering the work, not a certificate.`,
    `Some measures depend on the chip, so the choice of chip belongs in the review.`
  ],
  pitfalls: [
    `A high score means the product is secure — A score of 90 % with one critical gap is an unlocked door in a strong wall. Look at the critical items first.`,
    `Security is something to add before release — Set-up, identity and updates shape the whole design, and they are very costly to add at the end.`,
    `One strong measure can make up for a missing one — Defence works in layers: encrypted flash does not help a web page with no login.`
  ],
  terms: [
    { term: `Attack surface`, also: [`exposed interfaces`], def: `Everything a stranger can reach or send data to: open ports, web pages, radios, debug ports, update channels. Fewer, smaller and better-guarded interfaces mean a smaller surface.` },
    { term: `Defence in depth`, also: [`layered security`], def: `Using several independent protections, so that the failure of one does not open everything: a segment, a login, encrypted storage and signed updates together.` },
    { term: `Secure by default`, also: [`safe defaults`], def: `Shipping a product in its safe configuration: no default password, services closed until needed, encryption on. The user should have to choose to make it less safe.` },
    { term: `Critical gap`, also: [`blocking issue`, `showstopper`], def: `A missing measure so serious that one such gap lets an attacker in whatever else is done right, such as a hard-coded password or a TLS connection that does not verify.` }
  ],
  quiz: [
    { q: `A design scores 85 % overall but uses setInsecure() to reach its cloud broker. What does the checklist say?`, choices: [`It is fine: 85 % is high`, `The score is capped: the unverified connection is critical and comes first`, `Remove the other measures`, `Nothing: TLS is optional`], a: 1, why: `Without verification an impostor can pose as the broker and collect the device's secrets, whatever else is right. Critical gaps cap the score and are fixed first.` },
    { q: `Which chip cannot meet "secure boot and flash encryption are on in the product"?`, choices: [`ESP32-C3`, `ESP32-S3`, `A board with an ESP8266`, `ESP32-C6`], a: 2, why: `By the catalogue the ESP8266 has no secure boot and no flash encryption in hardware. The other three have both.` },
    { q: `A high checklist score is a security certificate.`, a: false, why: `The score is a way to compare designs and to order the work. It does not test the product, and it is not evidence for any regulation.` },
    { q: `When should the checklist be used?`, choices: [`Only just before the first sale`, `At design time, before shipping, and again every year`, `Only after a break-in`, `Never, if the chip has secure boot`], a: 1, why: `Set-up, identity and updates shape the design, so they need to be checked early; threats and dependencies change, so they need to be checked again.` }
  ],
  applications: [
    `A design review of a new sensor or switch before the first prototype batch.`,
    `A pre-release gate in a small company's process.`,
    `A buyer's checklist for an off-the-shelf connected device.`,
    `An annual check of the devices in a home or workshop.`
  ],
  sources: [
    `ETSI EN 303 645, *Cyber Security for Consumer Internet of Things: Baseline Requirements*.`,
    `NIST, *NIST IR 8259A, IoT Device Cybersecurity Capability Core Baseline*.`,
    `OWASP, *Internet of Things Project* and the IoT Security Verification Standard.`
  ],
  sim: 'cs-checklist'
}
);
