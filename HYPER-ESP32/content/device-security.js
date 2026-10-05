/* HYPER-ESP32 · content/device-security.js
 *
 * Topic: Securing the device (parent: security). Defensive only: how the owner of a device protects it, what each
 * protection is for and what it costs.
 *
 *   iot-threat-model                  what is valuable, from whom, through which door, at what cost
 *   secure-boot                       the chain of signature checks that decides what may run
 *   flash-encryption                  unreadable flash, development and release mode
 *   efuse-keys-and-key-storage        key blocks, purposes, read protection, the Key Manager
 *   nvs-encryption                    the key-value store, encrypted
 *   digital-signature-and-hmac        proving identity with a key software never sees
 *   disabling-debug-interfaces        closing JTAG and download mode
 *   trusted-execution-on-esp          a small trusted part beside the application
 *   secure-elements                   keys in a separate chip
 *   physical-attacks                  what remains when someone holds the board; chip revisions
 *   secure-ota                        signed updates, anti-rollback
 *
 * Simulations (sims/device-security.js): ds-attacker-doors, ds-chain-of-trust, ds-flash-contents, ds-efuse-keys,
 * ds-signing-oracle, ds-rollback, ds-two-worlds.
 */
Hyper.add(
/* ================================================================ a threat model */
{
  id: 'iot-threat-model',
  parent: 'device-security',
  title: 'A threat model for a small device',
  level: 1,
  short: 'Before choosing a protection, decide what is worth protecting, who might want it, through which door, and what closing that door costs. For a small device the whole exercise fits on one page.',
  keywords: ['threat model', 'threat modelling', 'attack surface', 'asset', 'attacker', 'stolen device', 'lost device', 'risk', 'security', 'blast radius', 'shared secret', 'device security', 'defence in depth', 'second-hand'],
  prereq: ['efuses', 'the-rom-bootloader', 'boot-modes-and-download-mode'],
  related: ['secure-boot', 'flash-encryption', 'physical-attacks', 'security-checklist', 'privacy-and-data-protection', 'regulations-cra-and-red', 'connection-security'],
  body: `Security work goes wrong in two opposite ways. Some builders do nothing, because "nobody would bother with my gadget". Others switch on every protection they have heard of, burn a few one-way fuses on their only board, and find they can no longer update it. Both skip the step that makes the rest sensible: deciding **what you are protecting, from whom, and what the protection costs**. That decision is a *threat model*, and for a small device it fits on a page.

This topic is for the owner who wants to protect a device: what each protection is for, and what it costs.

### Four questions

1. **What is valuable?** Usually a short list: the *credentials* the device holds (a Wi-Fi password, a cloud token, a private key), its *firmware* (your work, and a map of its bugs), the *data* it collects, the *power to act* (unlock a door, switch a heater) and its *identity*, which a clone could borrow.
2. **Who could want it, and what do they have?** A stranger on the network, a neighbour in radio range, or a person holding the unit: lost, stolen, bought second-hand, or installed where the public can touch it.
3. **How could they get at it?** Each way in is a *door*: the network, the update channel, the USB and serial port, the debug port, the flash chip itself.
4. **What does closing each door cost?** Every protection has a price: money, time, an irreversible step, a harder update, or a debug port you will miss.

### The attacker with the board in hand

| The attacker | Has | Protections that matter |
|---|---|---|
| Casual: a person with a USB cable | The board and a laptop | Close download mode and JTAG; flash encryption |
| Skilled: a soldering iron and a flash reader | The contents of the flash chip, and can rewrite it | Flash encryption and secure boot |
| Remote: anyone on the network | An address and a port | Not this topic: [[connection-security]] |
| Laboratory: equipment, time, one unit | Fault injection and measurement | Newer chips, per-device keys, cost |

### Match the effort to the harm

Ask three things of any design. **What does one stolen unit reveal?** The Wi-Fi password of one house is a small harm; the key that opens every unit in the field is a large one. **Do all units share a secret?** A password written into the firmware is in every unit, and one dump hands it to anyone: give each unit its own. **Can a flaw be fixed next year?** A device that cannot be updated safely is a liability whatever else it does ([[secure-ota]]).

The protections that follow answer those questions: [[flash-encryption]] hides what is inside, [[secure-boot]] decides what may run, [[disabling-debug-interfaces]] closes the doors made for developers, and [[physical-attacks]] says honestly what remains.

> [!key] A threat model is four questions: what is valuable, who could take it, through which door, and what closing the door costs. Protect in proportion to the harm, never ship one secret in every unit, and remember that most protections here are one-way.`,
  ideas: [
    'A threat model asks what is valuable, who could take it, through which door, and what closing the door costs.',
    'A device in someone\'s hand has more doors than one on a network: the flash chip, the serial port and the debug port.',
    'A secret shared by every unit turns one stolen board into a failure of the whole fleet; per-device secrets limit the damage.',
    'Most protections are one-way and take away something you may want later, such as recovery by cable or debugging.'
  ],
  pitfalls: [
    'Nobody would attack my little gadget — Attacks are rarely personal: stolen credentials and weak devices are collected in bulk. What matters is the harm if one unit is opened, not how interesting you are.',
    'More protections are always better — Each one costs something, and the one-way ones cannot be undone. Switch on what answers a threat you actually have, in the order that keeps you able to update and recover.',
    'Security means encryption — Encryption keeps secrets. It does not decide what code may run, close a debug port or stop a rollback. Each door needs its own lock.'
  ],
  terms: [
    { term: 'Threat model', also: ['threat modelling'], def: 'A short, written answer to: what is worth protecting, who might attack it, through which doors, and what it costs to close them. It decides which protections a device gets.' },
    { term: 'Asset', also: ['what to protect'], def: 'Something worth protecting in a device: a credential, the firmware, collected data, the power to switch something, or the identity of the device.' },
    { term: 'Attack surface', also: ['doors', 'ways in'], def: 'The sum of the ways in: every port, protocol, update channel and debug interface through which something outside can reach the device.' },
    { term: 'Blast radius', also: ['scope of compromise'], def: 'How much is lost when one unit is compromised. A secret shared by every unit gives a fleet-wide blast radius; a per-device secret keeps it to one unit.' }
  ],
  choose: {
    good: ['A product that holds credentials, controls something physical or keeps a secret shared by many units', 'Devices placed where strangers can touch them: a doorstep, a shop, a vehicle', 'Anything sold or given away, which may be opened by someone you will never meet'],
    avoid: ['Copying someone else\'s security settings without knowing which threat each one answers', 'Burning one-way protections on the only prototype you have', 'Hiding a secret in the firmware and calling it hidden'],
    check: ['What one stolen unit reveals, written in a sentence', 'Whether any secret is the same in every unit', 'How a flaw found next year would reach the units already in the field']
  },
  examples: [
    {
      title: 'A threat model for a smart plug',
      q: 'A Wi-Fi smart plug switches a heater. It is bought, plugged in, and may later be sold second-hand. Write down its threat model and say which protections it needs.',
      steps: [
        '**Assets:** the home Wi-Fi password, the cloud token that lets the app switch the heater, the firmware, and the power to turn a heater on.',
        '**Attackers:** someone on the internet (the connection, not this topic); a buyer of the second-hand plug, who holds the unit and may read its flash; a thief of a shared firmware secret, if one exists.',
        '**Doors:** the cloud connection, the update channel, the serial port, the flash chip. The unit sits indoors, so a laboratory attack is not worth the attacker\'s time.',
        '**Cost to close:** flash encryption hides the credentials from the second-hand buyer; secure boot and signed updates keep the update channel from becoming a way to take the heater; a per-device cloud token limits one stolen unit to one house. A factory reset that wipes the credentials answers the second-hand case without hardware.',
        '**Skipped on purpose:** a secure element or fault-injection hardening, which cost more than the harm they would prevent.'
      ],
      a: 'The plug needs flash encryption, secure boot with signed, rollback-protected updates, a per-device token and a factory reset. It does not need laboratory-grade protection.'
    }
  ],
  quiz: [
    { q: 'A sensor ships with the same MQTT password, written into its firmware, in every unit. What is the real danger?', choices: ['The password is too short', 'One dumped unit gives anyone the password for every unit', 'The firmware is too large', 'MQTT cannot be secured'], a: 1, why: 'A shared secret has a fleet-wide blast radius. Whoever reads one unit has the secret for all of them. A per-device credential limits the damage to the unit that was opened.' },
    { q: 'Which question belongs in a threat model?', choices: ['Which cipher is the fastest?', 'What does one stolen unit reveal?', 'Which chip has the most pins?', 'How many LEDs are on the board?'], a: 1, why: 'A threat model is about assets, attackers, doors and costs. Speed, pins and LEDs are design questions; "what does one unit reveal" tells you how much protection is proportionate.' },
    { q: 'A device that can never be updated is acceptable as long as it uses strong encryption.', a: false, why: 'Flaws are found after a product ships. If the device cannot be fixed, every flaw stays open for its whole life. A safe update path is part of the security of a product.' },
    { q: 'Which protection answers "someone reads the contents of the flash chip with a clip"?', choices: ['Secure boot', 'Flash encryption', 'Closing the JTAG port', 'A longer Wi-Fi password'], a: 1, why: 'Secure boot decides what may run, and closing JTAG closes a debug port; neither stops the memory chip being read directly. Only encrypting what is written to it does.' }
  ],
  applications: [
    'Deciding which of the protections in the next pages a smart plug, a door sensor or a weather station really needs.',
    'Reviewing a design before the first production run, while changing it is still cheap.',
    'Writing the security part of a product file that regulations now ask for ([[regulations-cra-and-red]]).',
    'Explaining why a unit has a debug port in the lab and none in the field.'
  ],
  sources: [
    'ETSI EN 303 645, *Cyber Security for Consumer Internet of Things: Baseline Requirements*.',
    'Espressif, *ESP-IDF Programming Guide*, the Security section: overview of secure boot, flash encryption and the other features.',
    'NIST IR 8259, *Foundational Cybersecurity Activities for IoT Device Manufacturers*.'
  ],
  sim: { id: 'ds-attacker-doors', params: { focus: 'model' } }
},

/* ================================================================ secure boot */
{
  id: 'secure-boot',
  parent: 'device-security',
  title: 'Secure boot',
  level: 2,
  short: 'The chip runs only firmware that its owner has signed: a chain of signature checks that starts in the chip\'s own ROM and ends at your program. It decides what may run; it does not hide anything.',
  keywords: ['secure boot', 'secure boot v2', 'signed firmware', 'signature', 'RSA-PSS', 'ECDSA', 'key digest', 'chain of trust', 'root of trust', 'espsecure', 'signing key', 'eFuse', 'verified boot'],
  prereq: ['the-rom-bootloader', 'efuses', 'iot-threat-model'],
  related: ['flash-encryption', 'secure-ota', 'efuse-keys-and-key-storage', 'disabling-debug-interfaces', 'physical-attacks', 'ota-partitions-and-rollback', 'soc-esp32'],
  body: `When a chip starts, it runs whatever is in its flash. If the flash can be rewritten, by a cable, by a clip on the memory chip or by a forged update, the device is only as trustworthy as the weakest of those ways in. **Secure boot** makes the chip itself refuse any program that its owner has not signed.

### A chain, one link at a time

The first link cannot be forged because it is made of silicon: the *ROM bootloader* ([[the-rom-bootloader]]) was written at the factory. With secure boot on, it checks the **signature** of the second-stage bootloader before jumping there; the bootloader then checks the signature of the application. If a check fails, that stage is not started: the bootloader may fall back to another valid image, otherwise the chip stops.

A signature is made with a **private key** that stays in the owner's build system and checked with the matching **public key**, which travels with the image. The chain is anchored by a **digest**, a hash of the public key, burned into the chip's eFuses ([[efuses]]). The chip hashes the key it finds in an image and compares; only the owner's key matches. Many newer chips hold up to three digests, so a leaked key can be revoked and replaced.

### What it does and does not do

Secure boot decides **what may run**. It stops a cable upload, a rewritten flash chip and a forged update from taking over the device. It does *not* hide anything (code stays readable unless there is [[flash-encryption]]), it does not stop an old but genuinely signed version being put back ([[secure-ota]]), and it does not cure bugs in your own program or a physical attack on the chip\'s own checks ([[physical-attacks]]).

### Which scheme on which chip

| Chip | Scheme (from the catalogue) |
|---|---|
| ESP32 | V1 (AES-based) before revision v3.0; V2 with RSA-PSS 3072 from v3.0 |
| ESP32-S2, S3, C3 | V2 with RSA-PSS 3072 |
| ESP32-C6, H2, C5, P4 | V2 with RSA-PSS 3072 or ECDSA |
| ESP32-C2, C61 | V2 with ECDSA-256 only |
| ESP8266 | none in hardware |

> [!warn] Turning secure boot on burns eFuses and is one-way: afterwards the chip runs only images signed with your key. Rehearse on a spare board, or with ESP-IDF's virtual eFuses, never first on a unit you cannot lose.

**The key becomes a liability.** Lose the only private key and units in the field can never be updated; leak it and anyone can sign for them. Keep it off the laptop (a hardware token or a locked-down signing service), back it up, and keep a spare digest slot where the chip has one. The tool \`espsecure\` makes keys and signs images. To see a chip's state without changing it, read the eFuses:

~~~sh
espefuse --port COM3 summary
~~~

> [!key] Secure boot is a chain of signature checks from the chip's ROM to your application, anchored by a hash of your public key in eFuses. It decides what may run; it is one-way, and the signing key becomes the most valuable thing you own.`,
  ideas: [
    'Secure boot is a chain: the ROM checks the bootloader, the bootloader checks the application, and each check is a digital signature.',
    'The anchor is a hash of your public key burned into eFuses; the private key never goes on the device.',
    'It controls what may run, not what can be read: pair it with flash encryption.',
    'It is one-way, and losing the signing key means no more updates for the units already protected.'
  ],
  pitfalls: [
    'Secure boot encrypts my firmware — It only authenticates it. Code and data stay readable in flash unless flash encryption is on as well.',
    'A signed image is a current image — An older, genuinely signed version passes the check. Stopping a rollback needs the separate anti-rollback counter.',
    'I can switch it off if it causes trouble — Once the eFuses are burned the chip insists on signed images for the rest of its life. Test on a spare board first.'
  ],
  terms: [
    { term: 'Secure boot', also: ['Secure Boot V2', 'verified boot'], def: 'A start-up sequence in which each stage checks a digital signature on the next before running it, so that only firmware signed by the owner can run. On the ESP32 family it is switched on once, in eFuses.' },
    { term: 'Chain of trust', also: ['trust chain'], def: 'The sequence of checks, each stage vouching for the next, that links the unchangeable ROM code to the application.' },
    { term: 'Root of trust', also: ['trust anchor'], def: 'The part that has to be trusted without anything else checking it: here the ROM code and the key digest in the eFuses.' },
    { term: 'Key digest', also: ['public key hash', 'SECURE_BOOT_DIGEST'], def: 'A hash of the public key, burned into eFuses. The chip accepts an image only if the key attached to it hashes to a digest the chip holds.' },
    { term: 'Digital signature', also: ['signature', 'RSA-PSS', 'ECDSA'], def: 'A value computed from a message and a private key that anyone with the public key can check. It proves that the message came from the key\'s owner and has not been changed.' },
    { term: 'Signing key', also: ['private key', 'release key'], def: 'The private key used at build time to sign firmware. It never goes on the device; it has to be guarded and backed up, because it can authorise firmware for every unit.' }
  ],
  choose: {
    good: ['Products where modified firmware would be dangerous or costly: locks, payment, mains, safety', 'Fleets updated over the air, where the update channel must not become a way in', 'Devices that hold or reach valuable credentials'],
    avoid: ['The only prototype, or boards still under development', 'A team with no safe place to keep and back up a signing key', 'Relying on it alone for secrecy: it authenticates, it does not hide'],
    check: ['Which scheme your chip and revision support', 'Where the signing key lives and who holds copies', 'How an update gets signed in your release process']
  },
  code: [
    {
      title: 'Is secure boot on?',
      about: 'Asks the chip whether secure boot is enabled and says what that means. It only reads: nothing here changes an eFuse. On a development board it will report that secure boot is off.',
      needs: 'Any ESP32-family board with a chip that supports secure boot, and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          if <secure boot is on?> then
            print [Secure boot: ON, only firmware signed with the owner's key runs]
          else
            print [Secure boot: off, any firmware flashed to this chip will run]
          end
      `,
      cpp: String.raw`
        #include "esp_secure_boot.h"

        void setup() {
          Serial.begin(115200);
          delay(1000);
          if (esp_secure_boot_enabled()) {
            Serial.println("Secure boot: ON, only firmware signed with the owner's key runs");
          } else {
            Serial.println("Secure boot: off, any firmware flashed to this chip will run");
          }
        }

        void loop() {}
      `,
      idf: String.raw`
        #include <stdio.h>
        #include "esp_secure_boot.h"

        void app_main(void)
        {
            if (esp_secure_boot_enabled()) {
                printf("Secure boot: ON, only firmware signed with the owner's key runs\n");
            } else {
                printf("Secure boot: off, any firmware flashed to this chip will run\n");
            }
        }
      `,
      na: { py: 'MicroPython has no call that reports secure boot. The state is in the eFuses: read them with espefuse on the computer, or check from a C or C++ program as shown.' },
      output: `
        Secure boot: off, any firmware flashed to this chip will run
      `,
      notes: ['The answer reflects the chip\'s eFuses, not the build settings: a firmware built with secure boot enabled on a chip whose eFuses are not burned still reports off.', 'The same call on the original ESP32 reports V1 or V2 alike; the scheme in use is a different question, answered by espefuse summary.']
    }
  ],
  quiz: [
    { q: 'What does the first link of the chain, the ROM bootloader, check?', choices: ['The application', 'The signature of the second-stage bootloader', 'The Wi-Fi password', 'The flash voltage'], a: 1, why: 'The ROM cannot be changed, so it is the root of the chain. It verifies the bootloader against the key digest in the eFuses; the bootloader then verifies the application.' },
    { q: 'A board with secure boot on is stolen. The thief clips onto the flash chip and writes a modified application into it. What happens at the next boot?', choices: ['It runs, because the flash is trusted', 'The bootloader finds that the signature does not match and refuses to run it', 'The ROM erases the eFuses', 'It runs without Wi-Fi'], a: 1, why: 'The modified image has no valid signature from the owner\'s key. The bootloader will not start it, whatever way it reached the flash.' },
    { q: 'Secure boot keeps the firmware secret from someone who reads the flash chip.', a: false, why: 'It authenticates firmware; it does not encrypt it. Hiding the contents is the job of flash encryption.' },
    { q: 'Why is the signing key worth more than any single device?', choices: ['Devices hold no keys at all', 'It can authorise firmware for every unit, and if it is lost no further updates can be accepted', 'It is used for the Wi-Fi password', 'It is stored in the cloud'], a: 1, why: 'The key digest in every unit is the hash of this one public key. Whoever holds the private key can sign for the whole fleet; if nobody does, nobody can update it.' }
  ],
  applications: [
    'Door locks, alarms and payment devices, where modified firmware could open a door or steal a card.',
    'Mains-connected products whose safety behaviour must not be replaced.',
    'Fleets of sensors updated over the air, where one forged update would reach every unit.',
    'Products that must show that only authentic firmware runs ([[regulations-cra-and-red]]).'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Secure Boot V2" and the security features overview of each chip.',
    'Espressif, *ESP32 Series Datasheet* and *ESP32-C3 Series Datasheet*, the security features.',
    'Espressif, *esptool documentation*: the espsecure and espefuse tools.'
  ],
  sim: 'ds-chain-of-trust'
},

/* ================================================================ flash encryption */
{
  id: 'flash-encryption',
  parent: 'device-security',
  title: 'Flash encryption',
  level: 2,
  short: 'The chip encrypts everything it writes to flash and decrypts it on the way back, with a key no software can read. Someone who reads the memory chip finds only noise. It protects secrecy, not authenticity.',
  keywords: ['flash encryption', 'XTS-AES', 'AES-256', 'ciphertext', 'development mode', 'release mode', 'encrypted flag', 'espsecure', 'encrypted partition', 'FLASH_CRYPT_CNT', 'transparent encryption', 'read flash'],
  prereq: ['flash-and-the-cache', 'efuses', 'secure-boot'],
  related: ['efuse-keys-and-key-storage', 'nvs-encryption', 'partition-tables', 'secure-ota', 'disabling-debug-interfaces', 'iot-threat-model', 'ota-updates'],
  body: `A microcontroller's program and its stored data usually sit in a separate flash memory chip, or in a die inside the same package, that anyone holding the board can read directly. Whatever is stored there (the Wi-Fi password, the cloud token, your whole program) is then as private as a text file. **Flash encryption** makes the chip scramble everything it writes to flash and unscramble it on the way back, so that the memory holds only ciphertext.

### How it works

The flash controller contains an AES engine. When the cache fetches code or data from an encrypted region the engine decrypts it on the fly; when the program writes, it encrypts. Your program never notices. The key comes from the chip's own random-number generator on first boot (or is supplied from outside), is stored in an eFuse key block and is **read-protected**: no software, yours included, can read it back ([[efuse-keys-and-key-storage]]).

The original ESP32 uses AES-256 with the key *tweaked by the address* of each block; later chips use XTS-AES-128, and the S2, S3, C5 and P4 also offer XTS-AES-256. The tweak means the same text at two addresses gives different ciphertext, so repetitions do not show. The simulation below makes it visible.

### What is and is not covered

The bootloader, the partition table and the application partitions are encrypted. A data partition is encrypted only if the partition table marks it *encrypted*, and writes to it must be aligned to the 16-byte cipher block. NVS has a scheme of its own ([[nvs-encryption]]). Anything stored outside the chip, on an SD card for instance, is not covered.

Encryption gives **secrecy, not authenticity**. Someone who flips bits in the ciphertext cannot read or choose what results, but cannot be stopped from garbling a block either. To know that code is genuine you need [[secure-boot]]; the two are normally switched on together.

### Development and release

**Development mode** is for trying it. The download door stays open, so plain firmware can still be uploaded and the bootloader encrypts it in place, and the setting can be switched back a few times (the chip counts the changes). **Release mode** is for products: the ROM's ways of reading flash back or accepting plain contents are shut, the counter is locked and nothing can be undone. Updates then arrive over the air ([[ota-updates]]) and the chip encrypts them as it writes.

> [!warn] Enabling flash encryption burns eFuses and, in release mode, cannot be reversed. A reader of the flash now sees only ciphertext, and that includes you: you cannot back up a unit by reading it. Rehearse in development mode on a spare board.

> [!key] Flash encryption makes everything in flash unreadable to someone who holds the chip, using a key that no software can read. It protects secrecy, not authenticity, so pair it with secure boot, and treat release mode as a one-way decision.`,
  ideas: [
    'The chip encrypts what it writes to flash and decrypts what it reads, transparently, with a key held in read-protected eFuses.',
    'The cipher mixes the block address into the encryption, so identical text at two addresses looks different.',
    'It hides contents but does not prove they are genuine: use it together with secure boot.',
    'Development mode can be tried and partly undone; release mode is permanent and closes the doors that would hand out plain flash.'
  ],
  pitfalls: [
    'Flash encryption protects everything on the board — Only the bootloader, the partition table, the applications and partitions marked encrypted. An SD card, an external chip or a plain data partition is outside it.',
    'Encrypted means tamper-proof — Ciphertext can be altered without a key; it just decrypts to garbage. Authenticity comes from secure boot, not from encryption.',
    'I will switch it on in production and see what happens — The first boot encrypts in place and release mode cannot be undone. Rehearse the whole production and update process on a spare board in development mode.'
  ],
  terms: [
    { term: 'Flash encryption', also: ['encrypted flash'], def: 'A chip feature that encrypts everything written to flash and decrypts it on the way back, using a key stored in read-protected eFuses, so that a reader of the memory chip sees only ciphertext.' },
    { term: 'XTS-AES', also: ['XTS', 'AES-XTS'], def: 'A mode of the AES cipher made for storage: every block is encrypted with a tweak that depends on its address, so equal data at different addresses gives different ciphertext. The chips after the original ESP32 use it.' },
    { term: 'Ciphertext', also: ['encrypted data'], def: 'Data after encryption: bytes that look random and mean nothing without the key. The opposite of plain text.' },
    { term: 'Development mode', also: ['flash encryption development mode'], def: 'A flash encryption setting for trying it out: plain firmware can still be uploaded by cable and encrypted in place, and encryption can be switched off a limited number of times.' },
    { term: 'Release mode', also: ['flash encryption release mode'], def: 'The permanent flash encryption setting for products: the ROM stops handing out or accepting plain flash contents and the enable counter is locked. It cannot be undone.' },
    { term: 'Encrypted flag', also: ['encrypted partition'], def: 'A mark in the partition table that makes a data partition encrypted too. Application partitions are encrypted automatically.' }
  ],
  choose: {
    good: ['Any device whose flash holds credentials, keys or code worth keeping private', 'Units that will be sold, installed in public places or sent back for repair', 'Products that already use secure boot, since the two complete each other'],
    avoid: ['Prototypes and boards you may need to read back or recover by cable', 'Release mode before the whole update process has been proven in development mode', 'Counting on it to stop tampering: it hides, it does not authenticate'],
    check: ['That your OTA and production tools encrypt for the chip or let it encrypt', 'Which of your data partitions carry the encrypted flag, and that their libraries write in 16-byte units', 'How a unit will be recovered or refurbished once release mode is on']
  },
  code: [
    {
      title: 'Is flash encryption on, and in which mode?',
      about: 'Asks the chip whether flash encryption is enabled, and in which mode. It only reads: nothing here changes an eFuse. On a development board it will report that flash encryption is off.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          if <flash encryption is on?> then
            if <flash encryption is in release mode?> then
              print [Flash encryption: ON, release mode (permanent)]
            else
              print [Flash encryption: ON, development mode]
            end
          else
            print [Flash encryption: off, the flash holds plain text]
          end
      `,
      cpp: String.raw`
        #include "esp_flash_encrypt.h"

        void setup() {
          Serial.begin(115200);
          delay(1000);
          if (!esp_flash_encryption_enabled()) {
            Serial.println("Flash encryption: off, the flash holds plain text");
            return;
          }
          if (esp_get_flash_encryption_mode() == ESP_FLASH_ENC_MODE_RELEASE) {
            Serial.println("Flash encryption: ON, release mode (permanent)");
          } else {
            Serial.println("Flash encryption: ON, development mode");
          }
        }

        void loop() {}
      `,
      idf: String.raw`
        #include <stdio.h>
        #include "esp_flash_encrypt.h"

        void app_main(void)
        {
            if (!esp_flash_encryption_enabled()) {
                printf("Flash encryption: off, the flash holds plain text\n");
                return;
            }
            printf("Flash encryption: ON, %s mode\n",
                   esp_get_flash_encryption_mode() == ESP_FLASH_ENC_MODE_RELEASE ? "release (permanent)" : "development");
        }
      `,
      na: { py: 'MicroPython has no call that reports flash encryption. The state is in the eFuses: read them with espefuse on the computer, or ask from a C or C++ program as shown.' },
      output: `
        Flash encryption: off, the flash holds plain text
      `,
      notes: ['The partition table below is a separate matter: with encryption off, the flags in it have no effect.']
    },
    {
      title: 'List the partitions and their encrypted flag',
      about: 'Prints every application and data partition with its address, size and whether the partition table marks it encrypted. The flag is what the table says; whether the chip really encrypts depends on flash encryption being on (the program above).',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          for each [part v] in (all partitions of the flash)
            print (join (name of (part)) [  encrypted flag: ] (encrypted flag of (part)))
          end
      `,
      cpp: String.raw`
        #include "esp_partition.h"

        void list(esp_partition_type_t type, const char *kind) {
          esp_partition_iterator_t it = esp_partition_find(type, ESP_PARTITION_SUBTYPE_ANY, NULL);
          while (it != NULL) {
            const esp_partition_t *p = esp_partition_get(it);
            Serial.printf("%-4s %-10s at 0x%06lx  %8lu bytes  encrypted flag: %s\n",
                          kind, p->label, (unsigned long)p->address, (unsigned long)p->size,
                          p->encrypted ? "yes" : "no");
            it = esp_partition_next(it);
          }
          esp_partition_iterator_release(it);
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          list(ESP_PARTITION_TYPE_APP, "app");
          list(ESP_PARTITION_TYPE_DATA, "data");
        }

        void loop() {}
      `,
      py: String.raw`
        from esp32 import Partition

        def show(kind, parts):
            for p in parts:
                ptype, subtype, addr, size, label, encrypted = p.info()
                print(kind, label, hex(addr), size, "bytes  encrypted flag:", "yes" if encrypted else "no")

        show("app", Partition.find(Partition.TYPE_APP))
        show("data", Partition.find(Partition.TYPE_DATA))
      `,
      notes: ['The list shows the layout of your own board, so the numbers differ from one partition scheme to the next ([[partition-tables]]).', 'A data partition that holds credentials but shows no here is readable from the memory chip even when flash encryption is on.']
    }
  ],
  quiz: [
    { q: 'A thief desolders the flash chip of a unit with release-mode flash encryption and reads it. What do they get?', choices: ['The firmware and the Wi-Fi password in clear text', 'Ciphertext that means nothing without a key the thief cannot read', 'Nothing: the chip is blank', 'The key, because it is stored next to the data'], a: 1, why: 'The key is in read-protected eFuses inside the chip, not in the memory. The memory holds only ciphertext, which is useless without that key.' },
    { q: 'Why does the same text stored at two addresses encrypt to different bytes?', choices: ['A random number is added each time', 'The cipher mixes the block address into the encryption', 'The flash chip scrambles it', 'It does not: equal text always gives equal ciphertext'], a: 1, why: 'XTS-AES (and the ESP32\'s address-tweaked AES-256) uses the address as a tweak. Without it, repeated patterns would show through in the ciphertext.' },
    { q: 'With flash encryption on and nothing else, nobody can alter the program in a way that makes the chip run something of their choosing.', a: false, why: 'Encryption alone gives no authenticity. Altering ciphertext garbles the decrypted block, which may crash the program, and an attacker who can copy blocks between units of the same key has more room still. Secure boot is what checks authenticity.' },
    { q: 'What is the main difference between development mode and release mode?', choices: ['Release mode is faster', 'Development mode can still take plain uploads by cable and be switched back a few times; release mode is permanent', 'Release mode uses a longer key', 'Development mode does not encrypt at all'], a: 1, why: 'Both encrypt. Development mode leaves the download door open and the counter unlocked so that you can rehearse; release mode shuts the doors and locks the counter.' }
  ],
  applications: [
    'Products that hold cloud tokens or device keys in flash and may be opened by a second-hand buyer.',
    'Devices installed in public places, such as meters, kiosks and sensors on poles.',
    'Firmware whose code is a trade secret, shipped in units that anyone can buy and dismantle.',
    'Devices returned for repair or recycling, whose flash may end up in someone else\'s hands.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Flash Encryption" (development and release mode, encrypted partitions).',
    'Espressif, *ESP32-S3 Series Datasheet*, the security section (XTS-AES); IEEE Std 1619-2007, the XTS-AES standard.',
    'Espressif, *esptool documentation*: the espsecure tool, for encrypting data on the computer.'
  ],
  sim: 'ds-flash-contents'
},

/* ================================================================ keys in eFuses */
{
  id: 'efuse-keys-and-key-storage',
  parent: 'device-security',
  title: 'Keys in eFuses',
  level: 2,
  short: 'Every protection rests on a key, and a key is only as safe as the place it is kept. eFuse key blocks hold keys that hardware can use and software cannot read; the newer Key Manager goes one step further.',
  keywords: ['eFuse key', 'key block', 'key purpose', 'KEY0', 'BLOCK_KEY0', 'read protection', 'write protection', 'RD_DIS', 'WR_DIS', 'key manager', 'HUK', 'PUF', 'hardware unique key', 'espefuse', 'virtual eFuse', 'key storage'],
  prereq: ['efuses', 'flash-encryption', 'secure-boot'],
  related: ['nvs-encryption', 'digital-signature-and-hmac', 'secure-elements', 'random-numbers-and-chip-identity', 'device-identity-and-provisioning', 'factory-programming', 'physical-attacks', 'soc-esp32-p4'],
  body: `Every protection in this topic rests on a key somewhere, and a key is only as safe as the place it is kept.

| Where the key is kept | Who can read it | What it costs |
|---|---|---|
| A constant in the firmware | Anyone with the program file | Nothing, and no protection |
| A file in plain flash or NVS | Anyone who can read the flash | Nothing |
| A file in encrypted flash | Any program running on the chip | Flash encryption |
| An eFuse key block, read-protected | Only the hardware that uses it | A one-way burn; few blocks |
| A secure element | Only that chip, through commands | An extra part ([[secure-elements]]) |

### Key blocks

Inside the eFuses ([[efuses]]) sit blocks of 256 bits meant for keys. The original ESP32 has three with fixed roles: the flash encryption key, the secure boot key and one for you. The later chips have six, KEY0 to KEY5, and each carries a **purpose**, a small field of its own: an XTS-AES key for flash encryption, a secure boot digest, one of several HMAC keys, an ECDSA key, or plain user data. The purpose decides which hardware may use the key: a key marked for HMAC cannot be loaded into the flash encryption engine.

Two more bits guard a block. **Read protection** hides it from the CPU: software, a debugger or a hijacked program reads zeros, and only the engine named by the purpose gets the key, by an internal path. **Write protection** stops more bits being burned later. Both are eFuses themselves and cannot be taken back.

### Six blocks go quickly

XTS-AES-256 flash encryption takes two, secure boot up to three for its digests, the Digital Signature one, an HMAC-based NVS key another. Write the plan down before any chip is burned ([[factory-programming]]). The user area is limited as well: 768 free bits on the ESP32, 256 on the C2, 1792 on most others (catalogue).

### The Key Manager

The ESP32-P4, the ESP32-C5 (revision v1.2 and later) and the ESP32-S31 have a **Key Manager**. It derives a *hardware unique key* from a physically unclonable function: a pattern that comes from tiny manufacturing differences in the chip's own memory cells and can be neither read nor copied. Keys for flash encryption, HMAC, DS or ECDSA are then deployed wrapped under it, so they never sit in an eFuse block as data at all.

> [!warn] Burning a key block is permanent: the key, its purpose and its protection bits. A read-protected key cannot be read back, not even by you, so keep what you must keep (the signing key, which never goes on the chip) in a safe place first. Rehearse with virtual eFuses.

> [!key] A key is safest where hardware can use it and nobody can read it: a read-protected eFuse key block, or the Key Manager. Give each chip its own keys, write the block plan before burning, and remember that every bit of it is one-way.`,
  ideas: [
    'A key is only as safe as the place it is kept; a read-protected eFuse key block can be used by hardware and read by nobody.',
    'On the later chips each of the six key blocks has a purpose that decides which hardware may use the key, and the purpose is burned too.',
    'Read protection and write protection are eFuse bits themselves: once set, they stay set.',
    'The Key Manager of the P4, C5 and S31 derives keys from the chip itself, so that they never sit in an eFuse at all.'
  ],
  pitfalls: [
    'A read-protected key can still be backed up when needed — Nobody can read it back, not even you. Keep copies of what you must keep (a signing key) outside the chip, and let the chip make the keys that need no copy.',
    'Any eFuse block can hold any key — On the later chips the purpose field decides which hardware may use a block, and the original ESP32 has fixed roles. A key burned with the wrong purpose stays that way.',
    'One key for every unit is simpler and just as safe — One dump of one unit then gives away the whole fleet. Per-device keys cost a little at the factory and limit the damage to a single unit.'
  ],
  terms: [
    { term: 'Key block', also: ['key slot', 'BLOCK_KEY0'], def: 'A 256-bit block of the eFuses meant to hold a key. The original ESP32 has three with fixed roles; the later chips have six that can be given any purpose.' },
    { term: 'Key purpose', also: ['KEY_PURPOSE'], def: 'A small eFuse field that says what a key block\'s key may be used for: flash encryption, a secure boot digest, an HMAC key, an ECDSA key or user data. It decides which hardware engine may load the key.' },
    { term: 'Write protection', also: ['WR_DIS'], def: 'An eFuse bit that stops further bits of a block or field being burned, freezing it. Together with read protection it is set when a secret key is burned.' },
    { term: 'Key Manager', also: ['key management unit'], def: 'A hardware block on the ESP32-P4, C5 (revision v1.2 and later) and S31 that derives a key from the chip itself and deploys other keys wrapped under it, so that they never appear as data in eFuses.' },
    { term: 'Hardware unique key', also: ['HUK', 'PUF', 'physically unclonable function'], def: 'A key a chip derives from its own physical properties, such as the start-up pattern of its memory cells. It differs in every chip, is never revealed and cannot be copied.' }
  ],
  choose: {
    good: ['Keys that hardware uses directly: flash encryption, HMAC and Digital Signature keys, ECDSA keys', 'Per-device secrets made on the chip itself, so that no copy ever exists', 'Chips with a Key Manager, in products that must never expose a key as data'],
    avoid: ['Keys as constants in the source code or as a plain file in flash', 'Burning keys before the block plan and the factory process are written down', 'One key shared by every unit'],
    check: ['That the purpose and the read- and write-protect bits are set in the same step', 'How many key blocks your chip has left once the plan is made', 'Where the keys that cannot be read back are backed up, if they must be']
  },
  examples: [
    {
      title: 'The block plan of an ESP32-S3 product',
      q: 'An ESP32-S3 product will use XTS-AES-128 flash encryption, secure boot with a production key and a backup key, the Digital Signature peripheral for its cloud identity, and an encrypted NVS keyed by HMAC. How many of the six key blocks does it use? Could it use XTS-AES-256 instead?',
      steps: [
        'Flash encryption with XTS-AES-128 needs **one** block. Secure boot needs one block for each digest: production and backup make **two**.',
        'The Digital Signature peripheral is unlocked by an HMAC key (purpose: for the Digital Signature): **one** block. The HMAC key for the encrypted NVS has a different purpose, so it takes **another**.',
        'The total is $1 + 2 + 1 + 1 = 5$ blocks, leaving one spare.',
        'XTS-AES-256 needs two blocks instead of one, so the total would be 6: it still fits, with nothing spare for a third secure boot digest or a key for re-enabling JTAG.'
      ],
      a: 'The plan uses five blocks and leaves one. XTS-AES-256 would fit exactly, with none left over.'
    }
  ],
  code: [
    {
      title: 'Audit the key blocks (read-only)',
      about: 'Prints, for each key block, its purpose number and whether it is read-protected and write-protected. It only reads: nothing here changes an eFuse. A fresh development board shows every block unused and unprotected.',
      needs: 'An ESP32-S2, S3, C3, C6 or later board (the original ESP32 has fixed roles and no purposes), and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          for each [block v] in (key blocks of the chip)
            print (join [KEY] (number of (block)) [  purpose ] (key purpose of (block)) [  read-protected: ] (read protection of (block)) [  write-protected: ] (write protection of (block)))
          end
      `,
      cpp: String.raw`
        #include "esp_efuse.h"
        #include "soc/soc_caps.h"

        void setup() {
          Serial.begin(115200);
          delay(1000);
        #if SOC_EFUSE_KEY_PURPOSE_FIELD
          for (int b = EFUSE_BLK_KEY0; b < EFUSE_BLK_KEY_MAX; b++) {
            esp_efuse_block_t blk = (esp_efuse_block_t)b;
            Serial.printf("KEY%d  purpose %2d  read-protected: %s  write-protected: %s\n",
                          b - EFUSE_BLK_KEY0, (int)esp_efuse_get_key_purpose(blk),
                          esp_efuse_get_key_dis_read(blk) ? "yes" : "no",
                          esp_efuse_get_key_dis_write(blk) ? "yes" : "no");
          }
        #else
          Serial.println("This chip has key blocks with fixed roles and no purpose fields.");
        #endif
        }

        void loop() {}
      `,
      na: { py: 'MicroPython has no call for the eFuse key blocks. Read them with espefuse summary on the computer, which is read-only, or use the C++ program.' },
      output: `
        KEY0  purpose  0  read-protected: no  write-protected: no
        KEY1  purpose  0  read-protected: no  write-protected: no
        KEY2  purpose  0  read-protected: no  write-protected: no
        KEY3  purpose  0  read-protected: no  write-protected: no
        KEY4  purpose  0  read-protected: no  write-protected: no
        KEY5  purpose  0  read-protected: no  write-protected: no
      `,
      notes: ['Purpose 0 is user data, which is also what an unused block shows. The other numbers name purposes; the list for your chip is in the ESP-IDF eFuse documentation.', 'A protected block still shows its purpose and flags: only its key is hidden.']
    }
  ],
  quiz: [
    { q: 'A key block is read-protected. What can use the key?', choices: ['Any program on the chip', 'Only the hardware engine named by the block\'s purpose', 'The bootloader and nothing else', 'esptool, with the right password'], a: 1, why: 'Read protection hides the block from the CPU. The engine that the purpose names (flash encryption, HMAC, DS, ECDSA) receives the key by an internal path; no software path exists.' },
    { q: 'A chip has six key blocks. A product wants XTS-AES-256 flash encryption (two blocks), three secure boot digests, one HMAC key for the Digital Signature and one HMAC key for NVS encryption. What follows?', choices: ['It fits with one block to spare', 'It needs seven blocks and does not fit', 'HMAC keys live in flash and need no block', 'Secure boot digests need no block'], a: 1, why: '2 + 3 + 1 + 1 = 7 blocks. Drop to XTS-AES-128 (one block) or to two digests, or choose a design with a Key Manager.' },
    { q: 'Giving every unit the same flash encryption key is a good practice, because one pre-encrypted image then fits all units.', a: false, why: 'A key shared by every unit has a fleet-wide blast radius: one successful extraction opens them all. Let each chip generate its own key and let it encrypt updates as it writes them.' },
    { q: 'What is special about the Key Manager of the P4, C5 and S31?', choices: ['It stores keys in the cloud', 'It derives a key from the chip itself so that other keys can be deployed without ever sitting in an eFuse block as data', 'It adds more eFuse blocks', 'It replaces secure boot'], a: 1, why: 'A hardware unique key from a physically unclonable function wraps the keys that are deployed, so the keys exist as data neither in eFuses nor in flash.' }
  ],
  applications: [
    'The flash encryption and secure boot keys of every protected product.',
    'A per-device HMAC key from which the device derives its storage and cloud secrets.',
    'The private key of the Digital Signature peripheral, kept as ciphertext whose unlocking key lives in an eFuse block.',
    'Products on the P4, C5 and S31 that must never show a key as data, even to their own bootloader.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "eFuse Manager" and the Key Manager chapter for the chips that have one.',
    'Espressif, *ESP32-S3 Series Datasheet* and *ESP32-P4 Datasheet*: the eFuse controller and key management sections.',
    'Espressif, *esptool documentation*: espefuse (summary, key purposes, protection).'
  ],
  sim: 'ds-efuse-keys'
},

/* ================================================================ encrypted NVS */
{
  id: 'nvs-encryption',
  parent: 'device-security',
  title: 'Encrypted NVS',
  level: 2,
  short: 'The key-value store where a program keeps its Wi-Fi password, tokens and counters can be encrypted on its own, with keys held either in a key partition under flash encryption or derived by the HMAC peripheral.',
  keywords: ['NVS encryption', 'nvs_keys', 'key partition', 'nvs_flash_secure_init', 'HMAC scheme', 'encrypted NVS', 'Preferences', 'credentials', 'XTS-AES', 'secure storage', 'nvs_flash_generate_keys'],
  prereq: ['nvs-and-preferences', 'flash-encryption', 'efuse-keys-and-key-storage'],
  related: ['digital-signature-and-hmac', 'credentials-handling', 'device-identity-and-provisioning', 'partition-tables', 'secure-provisioning', 'wifi-provisioning'],
  body: `NVS is the small key-value store in flash where programs keep what must survive a reset: the Wi-Fi network and its password, a cloud token, calibration, counters ([[nvs-and-preferences]]). Plain NVS holds names and values as they are, so whoever reads the partition reads the password and the token. **NVS encryption** encrypts the entries with XTS-AES, using two keys that have to come from somewhere safe.

### Two ways to hold the keys

**With flash encryption.** The two 32-byte NVS keys are generated once and kept in a small partition of their own, the *key partition* (subtype \`nvs_keys\`, 4 KB, listed in the partition table). Flash encryption protects that partition, so the keys are hidden in turn. This works on every chip that has flash encryption, the original ESP32 included, but it needs flash encryption to be on ([[flash-encryption]]).

**With the HMAC peripheral.** The keys are not stored at all. At every start the chip derives them with its HMAC engine from a key in an eFuse block ([[efuse-keys-and-key-storage]]) that software cannot read. There is no key partition and, the useful part, **no need for flash encryption**: an NVS partition can be protected on its own. It needs a chip with the HMAC peripheral, so not the original ESP32, the C2 or the C61. And because the HMAC key differs in every chip, an encrypted NVS cannot be copied to another unit.

### What it covers

The entries are unreadable to someone who dumps the partition. NVS keeps a checksum for each entry to catch corruption, but that is not a signature: this is secrecy, not authenticity ([[secure-boot]] is what authenticates).

### Costs and traps

- **A partition table with a key partition**, and a build with NVS encryption switched on. The prebuilt libraries of the Arduino core do not switch it on by default; this is an ESP-IDF feature.
- **Plain data cannot be read after the switch.** An encrypted build cannot open an old unencrypted NVS: plan a migration (read, enable, write back) or a re-provisioning.
- **Lose the keys, lose the data**, by design. With the HMAC scheme a replaced chip starts empty.
- **Only per-device secrets belong here.** A password shared by every unit is still shared when it is stored encrypted.

> [!key] Encrypted NVS keeps credentials unreadable in a dump. The keys come from a key partition under flash encryption, or from the HMAC peripheral with no flash encryption needed. Plan the partition table and the migration first, and store only per-device secrets.`,
  ideas: [
    'NVS encryption encrypts the entries of the key-value store with XTS-AES, using two 32-byte keys.',
    'Scheme one keeps the keys in a key partition that flash encryption protects; scheme two derives them from an eFuse HMAC key and needs no flash encryption.',
    'The HMAC scheme ties the data to the chip: an encrypted NVS cannot be moved to another unit.',
    'It protects secrecy, not authenticity, and an old plain NVS cannot be read after the switch.'
  ],
  pitfalls: [
    'Preferences encrypts what I store — The Arduino Preferences library writes to the default NVS partition as it is. Encryption is a property of how the partition is opened, and needs a key partition and a build option.',
    'Flash encryption already covers NVS — The NVS partition has a scheme of its own. Without the key partition (or the HMAC scheme), the entries sit in plain NVS format on the memory chip.',
    'I can switch it on in an update — The new build cannot read the old plain entries. Without a migration the device loses its settings, including its Wi-Fi password.'
  ],
  terms: [
    { term: 'NVS encryption', also: ['encrypted NVS'], def: 'A feature of the non-volatile storage library that encrypts the entries of an NVS partition with XTS-AES, so that a dump of the partition shows no names or values.' },
    { term: 'Key partition', also: ['nvs_keys'], def: 'A small partition of subtype nvs_keys that holds the two NVS keys when the flash-encryption scheme is used. Flash encryption protects it, so the keys are hidden in turn.' },
    { term: 'HMAC-based scheme', also: ['HMAC scheme'], def: 'The NVS encryption scheme in which the keys are derived at every start by the HMAC peripheral from a key in an eFuse block, so that no key is stored. It needs a chip with the HMAC peripheral.' }
  ],
  choose: {
    good: ['Per-device secrets such as Wi-Fi credentials, tokens and certificates written at provisioning', 'Chips with the HMAC peripheral, where protection of stored secrets is needed without full flash encryption', 'Products that also use flash encryption, with the key partition kept under it'],
    avoid: ['Shared secrets, which stay shared when encrypted', 'Arduino projects that cannot change the partition table or the build options', 'Switching it on in a field update without a migration'],
    check: ['Which scheme your chip supports (the catalogue lists the HMAC peripheral)', 'That the partition table has the key partition, or that the HMAC key is provisioned', 'How existing plain data will be moved']
  },
  code: [
    {
      title: 'Open an encrypted NVS and keep a secret in it',
      about: 'Finds the key partition, makes the two keys on the first start, opens the default NVS partition encrypted, then stores and reads back a made-up token. It is the flash-encryption-based scheme and needs a partition table with an nvs_keys partition.',
      needs: 'An ESP32-family board, ESP-IDF with a partition table that contains a 4 KB nvs_keys partition, and flash encryption on if the keys are to be protected.',
      blocks: `
        when started
          start serial at (115200) baud
          open encrypted storage using the key partition :: security
          save [a91f3c] as [api_token] :: security
          print (join [Read back: ] (load [api_token]))
      `,
      idf: String.raw`
        #include <stdio.h>
        #include "esp_partition.h"
        #include "nvs_flash.h"
        #include "nvs.h"

        void app_main(void)
        {
            // the key partition: 4 KB, subtype nvs_keys, listed in the partition table
            const esp_partition_t *keys = esp_partition_find_first(ESP_PARTITION_TYPE_DATA,
                                                                   ESP_PARTITION_SUBTYPE_DATA_NVS_KEYS, NULL);
            if (keys == NULL) {
                printf("No nvs_keys partition: add one to the partition table\n");
                return;
            }

            nvs_sec_cfg_t cfg;
            esp_err_t err = nvs_flash_read_security_cfg(keys, &cfg);
            if (err == ESP_ERR_NVS_KEYS_NOT_INITIALIZED) {
                err = nvs_flash_generate_keys(keys, &cfg);       // first start: make the two keys
            }
            if (err == ESP_OK) {
                err = nvs_flash_secure_init(&cfg);               // open the default "nvs" partition, encrypted
            }
            if (err != ESP_OK) {
                printf("Encrypted NVS failed: %s\n", esp_err_to_name(err));
                return;
            }

            nvs_handle_t h;
            ESP_ERROR_CHECK(nvs_open("secrets", NVS_READWRITE, &h));
            ESP_ERROR_CHECK(nvs_set_str(h, "api_token", "a91f3c"));
            ESP_ERROR_CHECK(nvs_commit(h));
            char token[16];
            size_t len = sizeof(token);
            ESP_ERROR_CHECK(nvs_get_str(h, "api_token", token, &len));
            printf("Read back from encrypted NVS: %s\n", token);
            nvs_close(h);
        }
      `,
      na: {
        cpp: 'The prebuilt Arduino libraries start NVS before setup() runs and do not enable NVS encryption, which needs a partition table with a key partition and a build option. Use ESP-IDF, or Arduino as a component of an ESP-IDF project.',
        py: 'MicroPython\'s esp32.NVS opens the default partition and has no way to be given keys, so it cannot read an encrypted NVS. Encrypted storage from MicroPython needs a firmware built with it.'
      },
      output: `
        Read back from encrypted NVS: a91f3c
      `,
      notes: ['With the NVS encryption option on in the project configuration, the ordinary start-up call does all of this itself on the flash-encryption scheme.', 'Use a made-up value while you rehearse. Never put a real token in an example that is shared.']
    }
  ],
  quiz: [
    { q: 'Which NVS encryption scheme works on a chip whose flash encryption is switched off?', choices: ['The one with the key partition', 'The HMAC-based one, on a chip that has the HMAC peripheral', 'Neither', 'Both'], a: 1, why: 'The key partition is only hidden if flash encryption is on. The HMAC scheme stores no key, so it stands on its own, provided the chip has the HMAC peripheral.' },
    { q: 'Why can an NVS protected with the HMAC scheme not be copied to another unit?', choices: ['The partition is checksummed', 'The keys are derived from an HMAC key in the eFuses, which differs in every chip', 'NVS uses the MAC address', 'The partition is locked by the bootloader'], a: 1, why: 'Another chip derives different keys from its own eFuse key, so it decrypts the copy to garbage.' },
    { q: 'Firmware built with NVS encryption can open an old, unencrypted NVS that holds Wi-Fi credentials.', a: false, why: 'The encrypted build expects encrypted entries. Plain entries are not readable by it, so the update must migrate them or the device must be provisioned again.' },
    { q: 'In the flash-encryption-based scheme, where are the NVS keys kept?', choices: ['In a key partition that flash encryption protects', 'In the application image', 'In RAM only', 'In the cloud'], a: 0, why: 'The keys sit in the small nvs_keys partition, which flash encryption makes unreadable to someone who reads the memory chip.' }
  ],
  applications: [
    'Wi-Fi credentials and cloud tokens stored by provisioning ([[wifi-provisioning]]).',
    'Per-device certificates and secrets written at the factory.',
    'Counters and licence data that must not be read or edited from a dump.',
    'Products on chips with the HMAC peripheral that cannot afford full flash encryption but must protect stored secrets.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "NVS Encryption" (the flash encryption and HMAC schemes) and the nvs_flash API reference.',
    'Espressif, ESP-IDF storage examples: the NVS encryption examples, one for each scheme.',
    'IEEE Std 1619-2007, the XTS-AES standard for encrypting stored data.'
  ],
  sim: { id: 'ds-flash-contents', params: { focus: 'nvs' } }
},

/* ================================================================ Digital Signature and HMAC */
{
  id: 'digital-signature-and-hmac',
  parent: 'device-security',
  title: 'The Digital Signature and HMAC peripherals',
  level: 3,
  short: 'Two peripherals that let a device prove who it is with a key that software never sees: the Digital Signature block signs, the HMAC block answers challenges and derives secrets, both with keys held in eFuses.',
  keywords: ['Digital Signature', 'DS peripheral', 'HMAC', 'HMAC peripheral', 'RSA_DS', 'ECDSA_DS', 'esp_hmac_calculate', 'challenge response', 'client certificate', 'esp_secure_cert', 'signing oracle', 'key derivation', 'device identity'],
  prereq: ['efuse-keys-and-key-storage', 'secure-boot', 'tls-on-esp'],
  related: ['mutual-tls', 'secure-elements', 'nvs-encryption', 'device-identity-and-provisioning', 'disabling-debug-interfaces', 'secure-provisioning'],
  body: `A device that connects to a cloud service often has to prove who it is. The usual way is a **private key** that only that device holds: the server sends a challenge, the device signs it, and the server checks the signature with the public key it knows. If the private key is just a file in flash, whoever copies the file *is* that device. Two peripherals keep the key where software cannot copy it.

### The Digital Signature peripheral

The DS peripheral computes an RSA signature (on some chips an ECDSA one) **without ever handing the key to the program**. The private key is stored only as ciphertext, in flash or NVS. The key that unlocks it is derived inside the chip by the HMAC engine from a read-protected eFuse key wired straight to the DS block. The program gives the peripheral a hash to sign; the peripheral decrypts the key internally, signs, and returns only the signature. A dump of the flash then holds a blob that is useless on any other chip. This is how a device takes part in a TLS handshake ([[mutual-tls]]) with a key nobody can copy.

### The HMAC peripheral

An **HMAC** is a keyed hash. The HMAC peripheral computes one with a key in an eFuse block, again unreadable, and has two ways of giving the answer:

- **Upstream**: the answer returns to the program. It serves as a challenge-response (the server sends a number, the device answers with its HMAC) or to **derive a secret per device** from one root key, such as the keys of an encrypted NVS ([[nvs-encryption]]).
- **Downstream**: the answer goes straight into another block, the DS peripheral or the JTAG switch ([[disabling-debug-interfaces]]), and the program never sees it.

### Which chip has what (catalogue)

| Chip | HMAC | RSA DS | ECDSA DS |
|---|---|---|---|
| ESP32, ESP32-C2 | no | no | no |
| ESP32-S2, S3, C3, C6 | yes | yes | no |
| ESP32-H2, C5, P4, S31 | yes | yes | yes |
| ESP32-C61 | no | no | yes |

### What it does and does not do

It stops **copying**: the key cannot be taken from a dump or a debugger and loaded into another device. It does not stop **use**. A program running on the chip can ask the peripheral to sign anything, so someone who gets their own code running can borrow the identity while they hold the device; [[secure-boot]] keeps foreign code off, and the two belong together. An upstream HMAC result also reaches the program, so a *derived* secret can leak even though the root key cannot.

Each unit needs a **provisioning** step that burns the HMAC key, a one-way act ([[device-identity-and-provisioning]]), and the key dies with its chip: it cannot be backed up.

> [!key] The DS and HMAC peripherals use keys that live in read-protected eFuses, so software can have a signature or an answer but never the key. They stop a key being copied; they do not stop code on the chip from asking, so pair them with secure boot.`,
  ideas: [
    'The Digital Signature peripheral signs with a private key it unlocks internally; the program receives only the signature.',
    'The HMAC peripheral answers challenges and derives per-device secrets from an eFuse key that software cannot read.',
    'Both stop a key being copied from a dump, not code on the chip from asking for a signature.',
    'The original ESP32 and the C2 have neither; the C61 has only the ECDSA signature block.'
  ],
  pitfalls: [
    'With the DS peripheral an attacker can never sign anything — Code running on the chip can request signatures. The peripheral protects the key from being copied; secure boot has to protect the chip from running foreign code.',
    'An HMAC result is as secret as the HMAC key — In upstream mode the result is handed to the program. A secret derived from it can be copied by code on the chip, though the root key stays hidden.',
    'The original ESP32 can do the same in software — A software signature needs the key in RAM and flash, which is exactly what these peripherals avoid. The ESP32 needs a secure element for the same protection.'
  ],
  terms: [
    { term: 'Digital Signature peripheral', also: ['DS', 'DS peripheral', 'RSA_DS', 'ECDSA_DS'], def: 'A hardware block that signs with a private key it unlocks internally, so that the program receives signatures but never the key. The RSA version is on most chips after the original ESP32; some also have an ECDSA version.' },
    { term: 'HMAC', also: ['keyed hash', 'HMAC-SHA-256'], def: 'A hash computed from a message and a secret key. Only someone who holds the key can produce or check it, so it proves knowledge of the key without revealing it.' },
    { term: 'HMAC peripheral', also: ['HMAC accelerator', 'HMAC block'], def: 'A hardware block that computes an HMAC with a key held in an eFuse block that software cannot read. Its result can be returned to the program (upstream) or passed to another block (downstream).' },
    { term: 'Challenge-response', also: ['challenge and response'], def: 'A proof of identity in which a verifier sends a fresh random value and the device answers with a value that only the holder of the key can compute, so that an old answer is of no use.' },
    { term: 'Signing oracle', also: ['oracle'], def: 'A device that signs whatever it is asked to. A key kept in hardware cannot be copied, but whoever can run code on the device can use it as an oracle while holding it.' }
  ],
  choose: {
    good: ['Devices that authenticate to a cloud with a certificate and must not be clonable from a dump', 'Per-device secrets derived from one eFuse root key', 'Products that also use secure boot, so that only the owner\'s code can ask for signatures'],
    avoid: ['The original ESP32 and the C2, which have neither peripheral (use a secure element)', 'Prototypes that cannot burn eFuses', 'Treating them as a substitute for secure boot'],
    check: ['That your chip has the peripheral you need (the table above)', 'The RSA key size your chip allows (3072 bits on the C3 and C6, 4096 on the S3, by the RSA accelerators listed in the catalogue)', 'How the HMAC key is burned for every unit in production']
  },
  code: [
    {
      title: 'Answer a challenge with a key the program cannot read',
      about: 'Asks the HMAC peripheral to compute an HMAC-SHA-256 of a challenge with the key in eFuse block KEY4 and prints the answer. It needs a key that was burned there earlier for this purpose; without one it only reports that none is usable, and it never changes an eFuse.',
      needs: 'An ESP32-S2, S3, C3, C6 or later board, with an HMAC key already provisioned in KEY4 (or none, to see the message), and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          set [answer v] to (HMAC of [server-challenge-0001] with the eFuse key in block (4)) :: security
          print (join [Answer: ] (answer))
      `,
      cpp: String.raw`
        #include "soc/soc_caps.h"
        #if SOC_HMAC_SUPPORTED
        #include "esp_hmac.h"
        #endif

        const uint8_t CHALLENGE[] = "server-challenge-0001";

        void setup() {
          Serial.begin(115200);
          delay(1000);
        #if SOC_HMAC_SUPPORTED
          uint8_t answer[32];                                   // an HMAC-SHA-256 is 32 bytes
          esp_err_t err = esp_hmac_calculate(HMAC_KEY4, CHALLENGE, sizeof(CHALLENGE) - 1, answer);
          if (err != ESP_OK) {
            Serial.printf("No usable HMAC key in KEY4: %s\n", esp_err_to_name(err));
            return;
          }
          Serial.print("Answer: ");
          for (int i = 0; i < 32; i++) Serial.printf("%02x", answer[i]);
          Serial.println();
        #else
          Serial.println("This chip has no HMAC peripheral.");
        #endif
        }

        void loop() {}
      `,
      na: { py: 'MicroPython does not expose the HMAC peripheral. Its hmac module computes in software, with the key held in RAM and flash, which is the opposite of the point of this page.' },
      notes: ['The block must already hold a key whose purpose allows the program to see the result (the upstream purpose). Burning it is a one-way provisioning step that this page does not show.', 'The server holds the same key, or a copy of the derivation, and checks that the answer matches the challenge it sent.']
    }
  ],
  quiz: [
    { q: 'What does the Digital Signature peripheral keep from the program?', choices: ['The message being signed', 'The private key', 'The signature', 'The challenge'], a: 1, why: 'The program supplies a hash and receives a signature. The private key stays inside, unlocked by a key that only the hardware can read.' },
    { q: 'Someone gets their own code running on a unit that uses the DS peripheral. What can they do with the identity?', choices: ['Copy the private key to another board', 'Ask the peripheral for signatures for as long as they hold the unit, but not copy the key', 'Nothing at all', 'Switch the HMAC key off'], a: 1, why: 'The key stays hidden, so it cannot be copied; but the code can request signatures, which makes the unit a signing oracle. Secure boot is what keeps their code off the chip.' },
    { q: 'The original ESP32 has an HMAC peripheral and a Digital Signature peripheral.', a: false, why: 'The catalogue lists neither for the original ESP32 or the C2. They arrived with the S2 and the chips after it. A secure element can give an ESP32 the same kind of protection.' },
    { q: 'Why can an upstream HMAC result still be a risk although the eFuse key is unreadable?', choices: ['The key leaks through the HMAC output', 'The result returns to the program, so code on the chip can copy a secret derived from it', 'HMAC is not a real cipher', 'It is too slow to use'], a: 1, why: 'Upstream mode hands the answer to software. The root key stays hidden, but a derived secret used as a key elsewhere is visible to whatever code runs on the chip.' }
  ],
  applications: [
    'TLS client authentication to a cloud broker with a key that cannot be copied ([[mutual-tls]]).',
    'Per-device derived secrets for encrypted storage ([[nvs-encryption]]).',
    'Re-enabling a closed JTAG port only for someone who can answer an HMAC challenge.',
    'Fleets that receive a certificate per device at the factory and must not be clonable from one dump.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, the Digital Signature (DS) and HMAC peripheral references and the esp_secure_cert documentation.',
    'Espressif, *ESP32-S3 Series Datasheet*: the HMAC accelerator and RSA Digital Signature chapters.',
    'IETF RFC 2104, *HMAC: Keyed-Hashing for Message Authentication*.'
  ],
  sim: { id: 'ds-signing-oracle', params: { where: 'ds' } }
},

/* ================================================================ closing JTAG and download mode */
{
  id: 'disabling-debug-interfaces',
  parent: 'device-security',
  title: 'Closing JTAG and download mode',
  level: 2,
  short: 'Two doors exist for the developer: the ROM\'s download mode and the JTAG debugger. On a unit in someone else\'s hands both are doors for them. They are closed in eFuses, so the price is permanent: recovery and debugging.',
  keywords: ['JTAG', 'download mode', 'secure download mode', 'disable JTAG', 'debug port', 'USB Serial/JTAG', 'DIS_DOWNLOAD_MODE', 'DIS_PAD_JTAG', 'DIS_USB_JTAG', 'soft disable JTAG', 'HMAC JTAG', 'golden unit', 'production'],
  prereq: ['boot-modes-and-download-mode', 'efuses', 'jtag-debugging'],
  related: ['flash-encryption', 'secure-boot', 'digital-signature-and-hmac', 'core-dumps-and-field-diagnostics', 'production-testing', 'ota-partitions-and-rollback', 'physical-attacks'],
  body: `Two doors on every ESP32-family chip are made for the developer: the ROM's **download mode**, which takes a new program over USB or a serial port, and **JTAG**, which lets a hardware debugger halt the chip and look at its memory ([[jtag-debugging]]). On a unit in somebody else's hands both are doors for someone else. They are closed in eFuses, so closing is permanent, and the price is exactly what made them useful: recovery and debugging.

### Download mode

With the boot pin held low at reset ([[boot-modes-and-download-mode]]) the ROM listens for commands: write flash and, with a small helper program, read it back and look at memory. There are three settings.

- **Open**, the default: everything works, as on the bench.
- **Secure Download Mode**: the ROM accepts only a short list of commands, with no read-back of flash and no helper program. Writing still works, within limits; a dump does not. It is a middle path, and not every chip and revision has it: the board guide of the ESP32-P4 notes that revision v3.1 lacks it.
- **Disabled**: the ROM refuses download mode altogether. No cable update, no recovery. Updates can only come from the program itself, over the air, so that path must be sturdy ([[ota-partitions-and-rollback]]).

### JTAG

JTAG has two routes. Chips with a built-in USB port carry it on that port; every chip also has JTAG on ordinary pins.

| Chip | JTAG on pins (catalogue) |
|---|---|
| ESP32 | GPIO12, 13, 14, 15 |
| ESP32-S3 | GPIO39 to 42, or the USB port |
| ESP32-C3, C6 | GPIO4 to 7, or the USB port |
| ESP32-H2, C5, P4 | GPIO2 to 5, or the USB port |

Which route is live is chosen by eFuses and, on some chips, a strapping pin (GPIO3 on the S3, GPIO15 on the C6). JTAG can be **left open**, **disabled for good** (separately for the two routes where both exist), or **disabled softly**: off until someone proves they hold an HMAC key, by answering a challenge ([[digital-signature-and-hmac]]). The soft way lets the maker debug a returned unit while nobody else can.

### Close the doors last

A staged plan works: all open in development; Secure Download Mode and a few open "golden" units, kept for investigation, before release; everything closed in the **last** step of the factory, after the production test ([[production-testing]]). Field faults are then diagnosed from logs and core dumps ([[core-dumps-and-field-diagnostics]]), so prove the update path first.

> [!warn] Closing download mode or JTAG burns eFuses. A unit with both shut and a broken update path cannot be recovered. Never close them on a board you cannot afford to lose; read the state first with espefuse summary, which only reads.

> [!key] Download mode and JTAG are developer doors; for units in the field, close them: Secure Download Mode as a middle path, JTAG disabled for good or softly with an HMAC key. It is permanent, so close last and keep a tested update path and a few open golden units.`,
  ideas: [
    'Download mode and JTAG are made for developers; on a unit in someone else\'s hands they are ways in.',
    'Download mode can be open, restricted (Secure Download Mode) or disabled for good; JTAG can be open, disabled for good or disabled until an HMAC key is proved.',
    'Closing is done in eFuses, so it is permanent, and it costs cable recovery and field debugging.',
    'Close them as the last factory step, keep a few open golden units and make sure the over-the-air path works.'
  ],
  pitfalls: [
    'Once JTAG is closed the device is safe — The flash chip can still be read directly if flash encryption is off. Each protection closes some doors and leaves others.',
    'I can reopen JTAG if I need it — A permanent disable cannot be undone. Only the soft disable with an HMAC key can be reopened, and only by someone who holds the key.',
    'Disabling download mode is just another build option — It burns an eFuse. With it shut, a bad update can only be repaired over the air, and if that path is broken the unit is lost.'
  ],
  terms: [
    { term: 'Secure Download Mode', also: ['secure download', 'ENABLE_SECURITY_DOWNLOAD'], def: 'A restricted state of the ROM download mode in which only a short list of commands works: no read-back of flash and no helper program. Not every chip and revision supports it.' },
    { term: 'JTAG', also: ['debug port', 'JTAG debugger'], def: 'A hardware debug interface that lets a probe halt the processor, step through code and read or write memory. On the ESP32 family it is reached through ordinary pins or through the USB port of the chip.' },
    { term: 'Soft JTAG disable', also: ['HMAC JTAG re-enable'], def: 'A setting that switches JTAG off until the holder of an HMAC key proves it by answering a challenge. Only the key holder can reopen the port.' },
    { term: 'Golden unit', also: ['reference unit'], def: 'A unit kept with its debug ports open, from the same production run as the closed ones, so that field faults can be reproduced and investigated.' }
  ],
  choose: {
    good: ['Units that leave your control: sold, installed in public, shipped to customers', 'Products already protected by flash encryption and secure boot, so the closed ports match the other locks', 'Fleets with a proven over-the-air update path and a few open golden units'],
    avoid: ['Closing anything on a prototype or on your only board', 'Disabling download mode before the over-the-air recovery has been tested', 'Counting on closed ports alone: they stop a cable, not a clip on the memory chip'],
    check: ['That your chip and revision support Secure Download Mode, if you want it', 'The eFuse state before and after, saved from espefuse summary', 'That the closing step comes after production test and is part of the factory process']
  },
  quiz: [
    { q: 'A unit has JTAG disabled for good and flash encryption off. A thief clips onto the flash chip. What happens?', choices: ['Nothing: the flash is protected by the closed JTAG port', 'They read the flash directly: closing JTAG does not touch the memory chip', 'The ROM erases the flash', 'The clip is detected by the eFuses'], a: 1, why: 'JTAG is a door into the processor. The memory chip is a separate door, closed only by flash encryption.' },
    { q: 'What does Secure Download Mode allow that fully disabling download mode does not?', choices: ['Reading the flash back', 'Writing firmware by cable, within limits', 'Debugging with JTAG', 'Changing eFuses'], a: 1, why: 'Secure Download Mode keeps a short list of commands, including writing, and drops read-back and the helper program. Disabling download mode removes all of it.' },
    { q: 'A permanent JTAG disable can be reversed later by whoever holds the right key.', a: false, why: 'Permanent means permanent. Only the soft disable, which is gated by an HMAC key, can be reopened, and only by someone who can answer its challenge.' },
    { q: 'When in the factory process should the debug ports be closed?', choices: ['Before the first power-up', 'After the production test, as the last step', 'Only if a customer asks', 'Never: they close themselves'], a: 1, why: 'Production test needs the ports; closing is irreversible. Do it last, after the unit has passed, and keep a few open golden units for investigation.' }
  ],
  applications: [
    'Closing the ports of units shipped to customers, after the factory test.',
    'Keeping golden units open to reproduce faults reported from the field.',
    'Letting the maker debug a returned unit with a soft-disabled JTAG that only an HMAC key reopens.',
    'Hardening units that sit in public places, such as meters, kiosks and sensors on poles.'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "JTAG Debugging" (security options) and the secure boot and flash encryption chapters on download mode.',
    'Espressif, *esptool documentation*: secure download mode and the espefuse tool.',
    'Espressif, datasheets of the ESP32, ESP32-S3, ESP32-C3 and ESP32-C6: the JTAG pin tables and strapping pins.'
  ],
  sim: { id: 'ds-attacker-doors', params: { focus: 'debug' } }
},

/* ================================================================ trusted execution */
{
  id: 'trusted-execution-on-esp',
  parent: 'device-security',
  title: 'A trusted execution environment',
  level: 3,
  short: 'Split the software in two: a small trusted part that holds secrets and does the sensitive work, and the application, which asks for it. The chip\'s permission controllers make the split real.',
  keywords: ['TEE', 'trusted execution environment', 'ESP-TEE', 'secure world', 'non-secure world', 'World Controller', 'permission controller', 'APM', 'PMS', 'PMP', 'attestation', 'secure storage', 'privilege separation', 'service call'],
  prereq: ['efuse-keys-and-key-storage', 'secure-boot', 'iot-threat-model'],
  related: ['digital-signature-and-hmac', 'secure-elements', 'physical-attacks', 'secure-ota', 'soc-esp32-c6', 'tasks'],
  body: `Your application is large, talks to the network and parses data from strangers. A bug in it, say an overflow in a web or Bluetooth parser, hands an attacker everything the application can reach: the keys in RAM, the stored credentials, the power to sign. A **trusted execution environment** (TEE) splits the software in two. A small *trusted* part holds the secrets and performs the sensitive operations. The rest, the *application*, runs without access to them and asks the trusted part for a service when it needs one.

### How the chip enforces it

A polite agreement would not do. The chip has privilege levels and **permission controllers** that mark regions of memory and peripherals as reachable only by the trusted side. Application code that touches them gets an access fault instead of data. The application reaches the trusted side only through a narrow, defined entry, a *service call* (on the RISC-V chips an environment call, which changes the privilege level) that carries a request and returns an answer, never a key. The simulation shows the idea: choose what the application tries and see what the controller does.

### Which chips

| Chip | Hardware (from the catalogue) |
|---|---|
| ESP32-S2 | permission control on internal and external memory |
| ESP32-S3, C3 | World Controller and permission control: a secure and a non-secure world |
| ESP32-C6, C5, C61, H2, P4, S31 | TEE controller and access permission management, with PMP |
| ESP32, ESP32-C2, ESP8266 | none |

Hardware is not software. **ESP-TEE**, Espressif's framework with a trusted part and a set of services (secure storage of keys, attestation, secure update of the trusted part), came first to the ESP32-C6. At the time of writing, check the ESP-IDF Programming Guide for the chips and versions that support it.

### What it gives, and what it costs

It limits the damage of a bug in the application: the attacker owns the application but not the keys. *Attestation* lets a device prove to a server which software it is running.

It costs flash and RAM for the trusted part, extra partitions, time for every service call, a stricter build and harder debugging. The trusted part must stay small, because a bug in it is a bug next to the keys. And a TEE does not defend against someone holding the board: that still needs flash encryption, secure boot and closed ports ([[physical-attacks]]). If all you need is "sign without showing the key", the DS or HMAC peripheral is simpler ([[digital-signature-and-hmac]]).

> [!key] A TEE keeps secrets and sensitive operations in a small trusted part that the chip's permission controllers wall off from the application, so a bug in the application cannot reach the keys. It costs memory and complexity, protects against software faults rather than a physical attacker, and needs software support on top of the hardware.`,
  ideas: [
    'A TEE splits the software: a small trusted part holds secrets and does sensitive work, and the application asks it for services.',
    'Permission controllers in the chip make the split real: the application gets an access fault if it touches what is reserved for the trusted side.',
    'Hardware for it is on many chips after the original ESP32; the ESP-TEE software framework came first to the ESP32-C6.',
    'It limits the damage of software bugs; it does not replace flash encryption, secure boot or closed debug ports.'
  ],
  pitfalls: [
    'A chip with a TEE controller has a TEE — The hardware only enforces a split that software sets up. Without a trusted part and its services, nothing is separated.',
    'A TEE makes the device safe from someone holding it — It protects against bugs in the application. A physical attacker is answered by flash encryption, secure boot, closed debug ports and the chip\'s own countermeasures.',
    'The trusted part can be as big as I like — A bug in it is a bug beside the keys. Keep it small and let the application do everything else.'
  ],
  terms: [
    { term: 'Trusted execution environment', also: ['TEE', 'ESP-TEE'], def: 'A small part of the software, isolated from the rest by hardware, that holds secrets and does sensitive operations on request. ESP-TEE is Espressif\'s framework for it.' },
    { term: 'Secure world', also: ['non-secure world', 'trusted world', 'REE'], def: 'The side of a split system that may touch protected memory and peripherals. The application runs in the other, non-secure world, and can use the secure side only through service calls.' },
    { term: 'Permission controller', also: ['APM', 'PMS', 'World Controller', 'PMP'], def: 'Hardware that decides, for each region of memory and each peripheral, which privilege level or world may read, write or run it. A forbidden access causes a fault.' },
    { term: 'Attestation', also: ['remote attestation'], def: 'A signed statement, produced by the trusted part, that tells a server which software a device runs, so that the server can decide whether to trust it.' },
    { term: 'Service call', also: ['secure service call', 'ecall'], def: 'The controlled entry from the application into the trusted part: a request goes in, an answer comes out, and no key crosses the boundary.' }
  ],
  choose: {
    good: ['Products with large, exposed application code (web, Bluetooth, parsers) that also keep keys or sign data', 'Devices that must attest their software to a server', 'Chips and ESP-IDF versions that support ESP-TEE'],
    avoid: ['Small devices where the DS or HMAC peripheral already does the sensitive job', 'Chips with no permission hardware, such as the original ESP32 and the C2', 'A big trusted part: it only moves the bugs next to the keys'],
    check: ['Whether your chip and ESP-IDF release support the TEE software, not only the hardware', 'How much flash, RAM and partition space the trusted part takes', 'Which services it offers and whether the ones you need exist']
  },
  quiz: [
    { q: 'An overflow in the application\'s web parser lets an attacker run their own code in the application. What does a TEE change?', choices: ['Nothing: code in the application can read any memory', 'Their code is still walled off from the keys held by the trusted part, and gets a fault if it tries to read them', 'The chip erases the application', 'The attacker\'s code is signed automatically'], a: 1, why: 'The permission controller reserves the trusted part\'s memory and peripherals. The application, hijacked or not, can only ask for a service.' },
    { q: 'Which chips in the catalogue have no permission hardware at all?', choices: ['ESP32-C6 and ESP32-P4', 'The original ESP32, the ESP32-C2 and the ESP8266', 'ESP32-S3 and ESP32-C3', 'Every chip has it'], a: 1, why: 'The catalogue lists World Controller or TEE controller hardware for the S2, S3, C3, C6 and later chips, and none for the original ESP32, the C2 or the ESP8266.' },
    { q: 'A TEE protects a stolen unit against someone who reads the flash chip directly.', a: false, why: 'The TEE separates software from software. Reading the memory chip is answered by flash encryption, and foreign code by secure boot.' },
    { q: 'Why should the trusted part be small?', choices: ['It must fit in RAM', 'A bug in it is a bug beside the keys, so less code means less risk', 'The permission controller only allows 4 KB', 'Large programs cannot be signed'], a: 1, why: 'The trusted part is trusted because it is small enough to get right. Every extra line is a place for a flaw that nothing else protects against.' }
  ],
  applications: [
    'Keeping a device private key and signing service apart from a large Wi-Fi and Bluetooth application.',
    'Attestation: a device proves to a cloud service which firmware it runs before it is given credentials.',
    'Secure storage of credentials that the exposed application can use but never read.',
    'Products on the RISC-V chips that must satisfy security rules for software isolation ([[regulations-cra-and-red]]).'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, the ESP-TEE documentation (supported chips, services, partitions).',
    'Espressif, *ESP32-C6 Series Datasheet* and *ESP32-S3 Series Datasheet*: the permission control, World Controller and TEE controller sections.',
    'RISC-V International, *The RISC-V Instruction Set Manual, Volume II: Privileged Architecture* (privilege levels and physical memory protection).'
  ],
  sim: 'ds-two-worlds'
},

/* ================================================================ secure elements */
{
  id: 'secure-elements',
  parent: 'device-security',
  title: 'Secure elements',
  level: 3,
  short: 'A separate small chip whose only job is to keep keys and use them: sign, verify, agree on secrets, count. The key is made inside and never leaves, which gives even an ESP32 without protected key hardware a safe place for its identity.',
  keywords: ['secure element', 'ATECC608', 'ATECC608B', 'SE050', 'OPTIGA Trust', 'STSAFE', 'crypto chip', 'key storage', 'I2C', 'provisioning', 'lock configuration', 'authenticated accessory', 'esp-cryptoauthlib'],
  prereq: ['efuse-keys-and-key-storage', 'digital-signature-and-hmac', 'i2c'],
  related: ['mutual-tls', 'device-identity-and-provisioning', 'secure-provisioning', 'i2c-pull-ups-and-bus-problems', 'physical-attacks', 'secure-boot'],
  body: `A **secure element** is a small, separate chip whose only job is to keep keys and use them. The keys are made inside it, can be locked so that they never leave, and are used through a short list of commands over I2C or a similar bus: sign this hash, verify that signature, agree on a shared secret, give me a random number, raise a counter. Microchip's ATECC608, NXP's SE050, Infineon's OPTIGA Trust and ST's STSAFE are examples; breakout boards of some of them exist for hobby use.

### Why add one to an ESP

- **Chips without protected key hardware.** The original ESP32, the ESP32-C2 and the ESP8266 have no Digital Signature or HMAC peripheral ([[digital-signature-and-hmac]]). A secure element gives them a private key that cannot be copied.
- **The key never meets your factory.** Many elements are provisioned by their maker, with a key pair and a device certificate that already exist inside; you learn only the public part.
- **Extras**: a unique serial number, a counter that only goes up, a hardware random number generator, and a way to authenticate an accessory or a consumable: the host challenges the part and checks its answer.

### Wiring and use

Power, ground, SDA and SCL, with the usual pull-ups ([[i2c-pull-ups-and-bus-problems]]); the ATECC608 answers at 0x60 unless its address was changed (check the datasheet). The ATECC family sleeps between commands and needs a wake-up pulse, which its libraries send; that is why a plain bus scan may miss it. A TLS library can hand the signing step of a handshake to the element, so that a device authenticates with a key that is never loaded into the ESP ([[mutual-tls]]). Espressif has published a library for the ATECC608; check the documentation for its present status.

### Limits

- **It protects the key, not the use.** The bus is on your board, and whoever holds the whole device can send commands: it is a signing oracle, as the simulation shows. Add secure boot, so that only your code can ask.
- **Locking is one-way.** The configuration and data zones are written and then locked, like an eFuse burn; an unlocked element accepts anything. Lock only when the plan is final.
- **An extra part**: board space, a driver, supply planning, a provisioning flow and a bus slower than on-chip hardware. The algorithms are the element's own: the ATECC608 does elliptic-curve P-256, not RSA.

> [!key] A secure element is a separate chip that makes and keeps keys and signs on request, so the key cannot be copied. It suits chips without protected key hardware, and it protects the key, not the use: lock it, and pair it with secure boot.`,
  ideas: [
    'A secure element makes and keeps keys inside a separate chip and uses them through commands over a bus.',
    'It gives the original ESP32, the C2 and the ESP8266, which lack the DS and HMAC peripherals, a key that cannot be copied.',
    'It protects the key, not its use: whoever holds the device can send commands, so pair it with secure boot.',
    'Locking its zones is one-way, and it adds a part, a driver and a provisioning step.'
  ],
  pitfalls: [
    'A secure element makes the device unclonable — The key cannot be copied, but the device can be used as it is: anyone holding it can ask the element to sign.',
    'I can lock it later when the design is final — An unlocked element accepts any configuration and, in some cases, any change. Lock it in the provisioning step, once the plan is final.',
    'A bus scan will always find it — Parts of this family sleep and ignore the bus until woken. Use the vendor library, which sends the wake-up pulse.'
  ],
  terms: [
    { term: 'Secure element', also: ['crypto chip', 'security IC', 'hardware security module'], def: 'A small separate chip that makes and stores keys and performs cryptographic operations on request, so that keys never leave it. It is reached over I2C or a similar bus.' },
    { term: 'ATECC608', also: ['ATECC608A', 'ATECC608B', 'CryptoAuthentication'], def: 'A common secure element from Microchip on the I2C bus, with elliptic-curve P-256 signing, key agreement, a random number generator, a unique serial number and counters.' },
    { term: 'Lock (of a secure element)', also: ['configuration lock', 'data zone lock'], def: 'The one-way step that freezes a secure element\'s configuration and data zones after they are written. Before it, the element can be reconfigured; after it, it cannot.' },
    { term: 'Authenticated accessory', also: ['consumable authentication'], def: 'A part, such as a cartridge or a sensor head, that carries a secure element so that the host can challenge it and check that it is genuine.' }
  ],
  choose: {
    good: ['Products on the original ESP32, the ESP32-C2 or the ESP8266 that need a key that cannot be copied', 'Devices that must be provisioned with a key that never passes through your factory', 'Accessories and consumables that the host must authenticate'],
    avoid: ['Chips that already have the DS or HMAC peripheral, unless a certification or a requirement asks for a separate element', 'Prototypes that cannot afford a one-way lock', 'Designs without secure boot, since an open device can still use the element'],
    check: ['Which algorithms the element has (the ATECC608 does elliptic curves, not RSA)', 'That the provisioning step configures and locks it, and who does it', 'That the library for your element and your ESP-IDF version are maintained']
  },
  quiz: [
    { q: 'A secure element holds a device\'s private key. Someone steals the whole device and runs their own code on it. What can they do with the identity?', choices: ['Copy the key to another board', 'Ask the element to sign, for as long as they hold the device, but not copy the key', 'Nothing at all', 'Read the key from the I2C bus'], a: 1, why: 'The key is made and kept inside the element and never crosses the bus. The commands it accepts, though, work for whoever sends them.' },
    { q: 'Why add a secure element to an original ESP32 design that must not be clonable?', choices: ['The ESP32 has no radio', 'The ESP32 has no Digital Signature or HMAC peripheral to protect a key', 'It is cheaper than eFuses', 'Elements make Wi-Fi faster'], a: 1, why: 'The catalogue lists neither peripheral for the original ESP32. A key kept in its flash or NVS can be copied from a dump; a key in an element cannot.' },
    { q: 'A secure element can be configured as often as you like, even after it is locked.', a: false, why: 'Locking its zones is one-way, like an eFuse burn. Configure it fully, check it, and only then lock it.' },
    { q: 'A bus scan finds nothing at address 0x60, but an ATECC608 is wired correctly. What is the likely reason?', choices: ['The chip is broken', 'It is asleep and needs a wake-up pulse before it answers', 'I2C cannot use address 0x60', 'The chip uses SPI only'], a: 1, why: 'The ATECC family sleeps between commands and ignores the bus until it is woken; the vendor library does that.' }
  ],
  applications: [
    'Cloud-connected devices on the original ESP32 that authenticate with a certificate and must not be clonable ([[mutual-tls]]).',
    'Products that must be provisioned by the element\'s maker so that no key passes through the assembly factory.',
    'Cartridges, batteries and sensor heads that the host authenticates against counterfeits.',
    'Unique serial numbers and monotonic counters for licences and usage limits.'
  ],
  sources: [
    'Microchip, *ATECC608 datasheet*: commands, zones, locking and the I2C interface.',
    'Espressif, *ESP-IDF Programming Guide* and the documentation of the esp-cryptoauthlib component, for the use of an ATECC608 with TLS.',
    'The datasheets of the NXP SE050, the Infineon OPTIGA Trust family and the ST STSAFE family, for the alternatives.'
  ],
  sim: { id: 'ds-signing-oracle', params: { where: 'element' } }
},

/* ================================================================ physical attacks and chip revisions */
{
  id: 'physical-attacks',
  parent: 'device-security',
  title: 'Physical attacks and chip revisions',
  level: 3,
  short: 'When someone holds the board and has a laboratory, protection means cost, not impossibility. What happened to the first ESP32, what later chips add, and why the revision of a chip is part of its security.',
  keywords: ['physical attack', 'fault injection', 'voltage glitch', 'glitch detector', 'side channel', 'DPA', 'differential power analysis', 'chip revision', 'ESP32 v3.0', 'security advisory', 'tamper', 'countermeasure', 'per-device keys'],
  prereq: ['iot-threat-model', 'secure-boot', 'flash-encryption', 'efuse-keys-and-key-storage'],
  related: ['disabling-debug-interfaces', 'secure-elements', 'trusted-execution-on-esp', 'soc-esp32', 'security-checklist', 'vulnerabilities-and-updates', 'enclosures'],
  body: `Everything so far assumed an attacker with ordinary tools. This page is about what is left when they have more, and the honest answer is **cost, not impossibility**. A protection raises what an attack costs in equipment, skill and time per unit. The designer's job is to make that cost exceed the value of what a unit holds, and to make sure that opening one unit does not open the rest.

### Three levels of effort

**Casual**: a USB cable and a laptop, which is most real incidents. Closed download mode and JTAG, with flash encryption, stop it. **Skilled**: a soldering iron and a flash reader. Reading plain flash takes minutes; flash encryption and secure boot answer it. **Laboratory**: equipment for *fault injection*, which disturbs the chip for an instant (a glitch on its supply or clock) in the hope that a security check is skipped, and for *side-channel analysis*, which studies tiny variations in power draw to learn about secret data. Both need the unit, equipment, expertise and time. This page does not describe how.

### What happened to the first ESP32

In 2019 and 2020 independent researchers published fault-injection attacks against early revisions of the original ESP32, aimed at its secure boot and its eFuse protections. Espressif issued security advisories, and chip revision v3.0 added countermeasures, together with Secure Boot V2. The lesson is not that anyone was careless: hardware security has a lifespan, and **the revision of the chip is part of its security**.

### What the later chips list (catalogue)

| Chip | Countermeasure |
|---|---|
| ESP32-S3, C3 | clock glitch detection |
| ESP32-C2 | clock glitch filter |
| ESP32-C5, C61, H2 | power glitch detector |
| ESP32-C6, C5, C61, H2, H21 | DPA protection |
| ESP32-P4, S31 | DPA-resistant encryption (configurable on the P4) |
| ESP32-C5, P4 (v3.x), H4, H21 | pseudo-round countermeasure in the cipher |

The original ESP32 and the ESP8266 list none. These are measures that raise cost, not guarantees.

### What the designer controls

- **Per-device keys**, so that a laboratory attack on one unit gives away one unit.
- **Least privilege**: a token that can only publish this device's own readings is worth little if extracted.
- **Chip and revision**: pick one with the countermeasures your threat model asks for, and know the revision of what you buy; the program below prints it.
- **Enclosure and layout**: no debug pads on the surface, sealed units, tamper evidence. They slow an attacker and do not stop one.

> [!key] A physical attacker with a laboratory is answered by cost: later chips add glitch detectors and DPA protection, and revision v3.0 fixed what researchers showed in the first ESP32. Check the revision you ship, give every unit its own keys, and protect in proportion to the value of what a unit holds.`,
  ideas: [
    'With a laboratory, an attacker is slowed and made to pay, not stopped; the aim is a cost above the value of what a unit holds.',
    'Fault injection disturbs the chip for an instant so a check is skipped; side-channel analysis learns from power draw. Both need unit, equipment and time.',
    'Early ESP32 revisions were shown vulnerable in 2019 and 2020, and revision v3.0 added countermeasures, so the chip revision is part of its security.',
    'Later chips list glitch detectors, DPA protection and similar measures; per-device keys limit what one successful attack gives away.'
  ],
  pitfalls: [
    'A chip with secure boot cannot be attacked in hardware — Secure boot checks signatures, but a disturbance at the right instant can try to make the check itself fail. Later chips add detectors; none claims to make it impossible.',
    'Every ESP32 has the same security — The first revisions had weaknesses that v3.0 fixed, and the later chips add countermeasures. Check the revision and the catalogue.',
    'Hiding the debug pads secures the board — It costs an attacker a little time. Real protection is flash encryption, secure boot, closed ports and per-device keys.'
  ],
  terms: [
    { term: 'Fault injection', also: ['glitching', 'voltage glitch', 'clock glitch'], def: 'Disturbing a chip for an instant, for example with a brief change of its supply voltage or clock, in the hope that it skips an instruction such as a security check.' },
    { term: 'Side-channel analysis', also: ['power analysis', 'side channel'], def: 'Learning about secret data from physical effects such as the power a chip draws while it processes it, rather than from its outputs.' },
    { term: 'DPA', also: ['differential power analysis', 'anti-DPA'], def: 'A side-channel technique that compares power measurements over many operations to find a key. DPA protection in a cipher block is built to defeat it.' },
    { term: 'Glitch detector', also: ['clock glitch detection', 'power glitch detector'], def: 'A circuit that notices an abnormal pulse on the chip\'s clock or supply and responds, for example by resetting, so that fault injection is harder.' },
    { term: 'Chip revision', also: ['silicon revision', 'v3.0'], def: 'The version of the silicon itself, written v3.0 and so on. Security features and fixes depend on it; the original ESP32 has Secure Boot V2 only from revision v3.0.' }
  ],
  choose: {
    good: ['Choosing a chip and revision with countermeasures that match the value of what the unit holds', 'Per-device keys and least-privilege tokens, which cost almost nothing', 'Products with a real risk of laboratory attack: locks, payment, high-value fleets'],
    avoid: ['Spending laboratory-grade effort on a device whose worst case is one house\'s Wi-Fi password', 'Relying on hidden pads or glued screws as protection', 'Buying old-revision ESP32 modules for a product that needs Secure Boot V2'],
    check: ['The chip revision of the modules you will actually receive', 'The countermeasures the catalogue lists for your chip, and the advisories published for it', 'What one successful attack on one unit would give away']
  },
  code: [
    {
      title: 'Which chip revision is this?',
      about: 'Prints the chip model and revision and says whether it is one of the older ESP32 revisions, which lack Secure Boot V2. It only reads.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        when started
          start serial at (115200) baud
          print (join [Chip revision: ] (chip revision))
          if <chip is an older ESP32 revision?> then
            print [Older ESP32 silicon: no Secure Boot V2, and the fault-injection fixes came with v3.0]
          else
            print [This is not one of the older ESP32 revisions]
          end
      `,
      cpp: String.raw`
        #include "esp_chip_info.h"

        void setup() {
          Serial.begin(115200);
          delay(1000);
          esp_chip_info_t info;
          esp_chip_info(&info);
          int major = info.revision / 100, minor = info.revision % 100;   // the format is major * 100 + minor: 301 is v3.1
          Serial.printf("%s, chip revision v%d.%d\n", ESP.getChipModel(), major, minor);
          if (info.model == CHIP_ESP32 && info.revision < 300) {
            Serial.println("Older ESP32 silicon: no Secure Boot V2, and the fault-injection fixes came with v3.0");
          } else {
            Serial.println("This is not one of the older ESP32 revisions");
          }
        }

        void loop() {}
      `,
      na: { py: 'MicroPython has no call that reports the chip revision. The esptool program on the computer prints it when it connects to the chip.' },
      output: `
        ESP32-D0WD-V3, chip revision v3.1
        This is not one of the older ESP32 revisions
      `,
      notes: ['The model text depends on the board; the revision number is what matters. ESP32 modules sold today are usually v3.0 or later, and old stock still exists.', 'A revision above the limit is no guarantee: it only rules out the weaknesses that were fixed.']
    }
  ],
  quiz: [
    { q: 'What does it mean for a protection to be effective against a laboratory attacker?', choices: ['It makes the attack impossible', 'It raises the cost in equipment, skill and time above the value of what the unit holds', 'It hides the chip from view', 'It needs a password'], a: 1, why: 'Against an attacker with equipment and time nothing can be promised to be impossible. The design aim is that an attack costs more than it yields, and that one unit gives away only one unit.' },
    { q: 'Why does the chip revision matter for the original ESP32?', choices: ['The revision decides the Wi-Fi speed', 'Secure Boot V2 and fixes to the fault-injection weaknesses arrived with revision v3.0', 'Only old revisions have eFuses', 'It does not matter'], a: 1, why: 'The catalogue lists Secure Boot V2 from revision v3.0, and researchers\' 2019 and 2020 attacks on early revisions led to countermeasures in v3.0.' },
    { q: 'A device keeps the same secret in every unit. A laboratory attack succeeds on one of them. What follows?', choices: ['Only that unit is affected', 'Every unit that shares the secret is affected', 'The attack is detected by the others', 'Nothing: laboratory attacks cannot extract secrets'], a: 1, why: 'A shared secret has a fleet-wide blast radius. Per-device keys would turn the same successful attack into the loss of one unit.' },
    { q: 'Hiding the debug pads under the enclosure is a strong protection against a skilled attacker.', a: false, why: 'It costs an attacker a little time. Protection comes from flash encryption, secure boot, closed debug ports and per-device keys.' }
  ],
  applications: [
    'Choosing the chip and revision for a lock, a payment device or a meter that holds valuable secrets.',
    'Deciding that a home sensor needs no laboratory-grade protection, and spending the effort on per-device keys and updates.',
    'Reading Espressif\'s security advisories for the chips in a product, and planning updates for them ([[vulnerabilities-and-updates]]).',
    'Setting a minimum chip revision in a build so that units made on old silicon are not shipped.'
  ],
  sources: [
    'Espressif, security advisories of 2019 and 2020 on fault injection against the original ESP32\'s secure boot and eFuse protections (published on the company\'s website).',
    'Espressif, *ESP32 Series Datasheet* and the datasheets of the later chips: the security features and chip revision notes.',
    'Espressif, *ESP-IDF Programming Guide*, the Security section: the chip support table for secure boot and flash encryption.'
  ],
  sim: { id: 'ds-attacker-doors', params: { focus: 'physical' } }
},

/* ================================================================ secure OTA */
{
  id: 'secure-ota',
  parent: 'device-security',
  title: 'Signed updates and anti-rollback',
  level: 3,
  short: 'An update replaces the whole program, so the update channel is the most powerful door a device has. Check who sent it, that it is current, and keep a way back from a bad one: three questions, three mechanisms.',
  keywords: ['signed OTA', 'secure OTA', 'anti-rollback', 'secure version', 'rollback', 'pending verify', 'signature verification', 'signed app', 'update', 'CONFIG_BOOTLOADER_APP_ANTI_ROLLBACK', 'encrypted OTA', 'downgrade'],
  prereq: ['secure-boot', 'ota-updates', 'ota-partitions-and-rollback', 'https-and-tls'],
  related: ['efuse-keys-and-key-storage', 'flash-encryption', 'versioning-and-releases', 'vulnerabilities-and-updates', 'ota-from-a-server', 'iot-threat-model'],
  body: `An update channel replaces the whole program, which makes it the most powerful door a device has. Three questions decide whether it is safe. **Who may send an update?** Only the owner: authenticity. **Is it the update intended, and a current one?** Integrity and freshness. **Can the device survive a bad update?** Recovery. Each has its own mechanism, and none replaces another.

### The layers

1. **The connection.** HTTPS with the server's certificate checked ([[https-and-tls]]) tells the device it is talking to the real server. It says nothing about the file if the server, a cache or the build pipeline has been tampered with.
2. **The signature on the image.** The owner signs the image before it leaves the build system; the device verifies it before switching to it, and with secure boot ([[secure-boot]]) the bootloader verifies it again at every start. ESP-IDF can also check signatures on updates *without* hardware secure boot: a weaker, reversible option, because the key digest is not in eFuses and someone with physical access could replace the checking bootloader.
3. **Anti-rollback.** A signature says "genuine", not "current": an old, signed version with a known hole would pass. The image therefore carries a *secure version*, a small integer; the chip keeps a one-way counter in eFuses, and the bootloader refuses any image below it.
4. **Rollback of a bad update.** Separately, a new image starts *pending*; if it does not mark itself valid after a self-test, the next reset returns to the previous slot ([[ota-partitions-and-rollback]]). This protects against your own mistakes, not against attackers.
5. **Confidentiality.** ESP-IDF can deliver images encrypted for one device; otherwise the TLS channel hides them in transit.

### The secure version is not the version number

The version string is for people. The secure version rises only when an update **fixes a vulnerability**, never for a feature release, because the counter is a few eFuse bits and every step burns one. A counter with a limited number of steps allows only that many security increments in the life of a unit, and an older image can never be reinstalled again, even by you.

~~~ini
CONFIG_BOOTLOADER_APP_ROLLBACK_ENABLE=y
CONFIG_BOOTLOADER_APP_ANTI_ROLLBACK=y
CONFIG_BOOTLOADER_APP_SECURE_VERSION=3
~~~

These settings describe a build: the counter is raised when the new image marks itself valid.

> [!warn] Raising the secure version burns an eFuse bit each time. Rehearse the whole cycle (offer, install, self-test, counter) on a spare board before shipping, and plan how many increments the product's life will need.

> [!key] Check who sent an update (signature), that it is current (secure version and the eFuse counter), and that the device can fall back from a bad one (pending state and rollback). Raise the counter only for security fixes: it is one-way and finite.`,
  ideas: [
    'An update must be authentic (signed), current (anti-rollback) and survivable (rollback of a bad image): three questions, three mechanisms.',
    'HTTPS authenticates the server, the signature authenticates the file: you need both.',
    'Anti-rollback keeps a one-way counter in eFuses and refuses any image whose secure version is below it; app rollback only returns to the previous slot after a failed self-test.',
    'Raise the secure version only for security fixes: the counter is finite and cannot be lowered.'
  ],
  pitfalls: [
    'Rollback and anti-rollback are the same thing — Rollback is a safety net for a bad update of your own. Anti-rollback is a security rule against old, vulnerable versions. A device can have either or both.',
    'HTTPS is enough to trust an update — It authenticates the server, not the file. A tampered build pipeline or cache serves a perfectly valid HTTPS download of a bad image.',
    'Raise the secure version with every release — Every step burns an eFuse bit and the counter is finite. Spend it only on updates that close a security hole.'
  ],
  terms: [
    { term: 'Anti-rollback', also: ['downgrade protection', 'secure version counter'], def: 'A one-way counter kept in eFuses. The bootloader refuses any firmware image whose secure version is lower than the counter, so an old, vulnerable version cannot be reinstalled.' },
    { term: 'Secure version', also: ['security version', 'secure_version'], def: 'A small integer in the firmware image, separate from its version string. It is raised only for updates that fix a vulnerability, and it is compared with the eFuse counter.' },
    { term: 'App rollback', also: ['pending verify', 'automatic rollback'], def: 'A mechanism by which a new image starts in a pending state and must mark itself valid after a self-test; if it does not, the next reset returns to the previous image.' },
    { term: 'Signed update', also: ['signed image', 'signature verification'], def: 'An update image that carries a digital signature made with the owner\'s key, checked by the device before it switches to the image.' }
  ],
  choose: {
    good: ['Any device updated over the air whose update channel could be a way to take it over', 'Products with secure boot, where the same signature protects updates and every start', 'Fleets with a policy for when the secure version rises'],
    avoid: ['Raising the secure version for ordinary releases', 'Anti-rollback without tested app rollback: a failed update could then leave a unit unable to go back', 'Skipping the signature because the connection is HTTPS'],
    check: ['How many secure version steps your chip\'s counter allows', 'That the signing key is guarded and backed up', 'That the self-test that marks an image valid is real, not a formality']
  },
  examples: [
    {
      title: 'Budgeting the counter',
      q: 'A product will be supported for ten years. Its security counter has 16 steps (an example size: read your chip\'s). Past experience suggests about two security fixes a year. Does the counter last? What policy would make it last?',
      steps: [
        'Two fixes a year for ten years need $2 \\times 10 = 20$ steps, more than the 16 available.',
        'The counter would run out after $16 / 2 = 8$ years: the last two years could not take a security fix that raises the counter.',
        'The policy: raise the secure version only for fixes whose old versions are dangerous to leave installable, and group fixes. Fifteen steps for ten years is one and a half a year.',
        'Keep the feature releases at the same secure version: they cost no steps.'
      ],
      a: 'At two increments a year the counter lasts eight years, so group fixes and raise it only for serious ones.'
    }
  ],
  code: [
    {
      title: 'Decide whether an offered update may be installed',
      about: 'A first filter in the application: refuse an offer below the lowest version the owner allows or older than the running one, skip the running one, and install anything newer. The signature and the eFuse counter, not this rule, are the real defence; this stops mistakes and some downgrades early.',
      needs: 'Any ESP32-family board and the serial monitor at 115200 baud.',
      blocks: `
        define decide (offered)
          if <(offered) < (6)> then
            print (join [offer ] (offered) [: refuse, below the minimum the owner allows])
          else if <(offered) < (7)> then
            print (join [offer ] (offered) [: refuse, older than the running version])
          else if <(offered) = (7)> then
            print (join [offer ] (offered) [: skip, already running])
          else
            print (join [offer ] (offered) [: install])
          end

        when started
          start serial at (115200) baud
          for each [version v] in (list (9) (7) (5) (6) (8))
            decide (version) :: my
          end
      `,
      cpp: String.raw`
        const int RUNNING_VERSION = 7;     // the version of the firmware that is running
        const int MIN_ALLOWED = 6;         // the lowest version the owner still allows

        const char *decide(int offered) {
          if (offered < MIN_ALLOWED) return "refuse, below the minimum the owner allows";
          if (offered < RUNNING_VERSION) return "refuse, older than the running version";
          if (offered == RUNNING_VERSION) return "skip, already running";
          return "install";
        }

        void setup() {
          Serial.begin(115200);
          delay(1000);
          const int offers[] = {9, 7, 5, 6, 8};
          for (int v : offers) Serial.printf("offer %d: %s\n", v, decide(v));
        }

        void loop() {}
      `,
      py: String.raw`
        RUNNING_VERSION = 7     # the version of the firmware that is running
        MIN_ALLOWED = 6         # the lowest version the owner still allows

        def decide(offered):
            if offered < MIN_ALLOWED:
                return "refuse, below the minimum the owner allows"
            if offered < RUNNING_VERSION:
                return "refuse, older than the running version"
            if offered == RUNNING_VERSION:
                return "skip, already running"
            return "install"

        for v in (9, 7, 5, 6, 8):
            print(f"offer {v}: {decide(v)}")
      `,
      output: `
        offer 9: install
        offer 7: skip, already running
        offer 5: refuse, below the minimum the owner allows
        offer 6: refuse, older than the running version
        offer 8: install
      `,
      notes: ['A manifest fetched over the network can be forged, which is why the signature check and the eFuse counter are the defence and this rule is only a convenience.', 'In a real update the offered number comes from the manifest, and the running number from the image\'s own description.']
    }
  ],
  quiz: [
    { q: 'An attacker controls the network and offers the device an old firmware version with a known hole, genuinely signed by the owner last year. Which mechanism refuses it?', choices: ['HTTPS certificate checking', 'The signature check', 'Anti-rollback: the secure version is below the eFuse counter', 'App rollback'], a: 2, why: 'The signature is genuine and the connection may be fine. Only the counter, raised by later security fixes, makes the bootloader refuse an older secure version.' },
    { q: 'What does app rollback protect against?', choices: ['A bad update of your own: the new image fails its self-test and the device returns to the previous slot', 'An attacker installing an old version', 'A stolen signing key', 'A cloned device'], a: 0, why: 'It is a safety net: an image that does not mark itself valid is abandoned at the next reset. It does not stop anybody installing an old image that passes its own test.' },
    { q: 'The secure version should be raised with every release, so that the counter always matches the version number.', a: false, why: 'Each step burns an eFuse bit and the counter is finite. Raise it only for updates that close a security hole.' },
    { q: 'HTTPS with a checked server certificate makes an image signature unnecessary.', a: false, why: 'HTTPS tells the device who it talks to, not whether the file is the owner\'s. A tampered server, cache or build pipeline delivers a bad image over a perfectly valid connection; the signature catches that.' }
  ],
  applications: [
    'Over-the-air updates of door locks, meters and appliances whose update server could be a target.',
    'Closing a vulnerability for good: the update raises the secure version so the old, vulnerable image cannot return.',
    'Fleets whose build pipeline signs images with a key held in a signing service.',
    'Meeting rules that require security updates and protection of the update mechanism ([[regulations-cra-and-red]]).'
  ],
  sources: [
    'Espressif, *ESP-IDF Programming Guide*, "Over The Air Updates" and the sections on app rollback and anti-rollback in the bootloader documentation.',
    'Espressif, *ESP-IDF Programming Guide*, "Secure Boot V2" (signing images, verifying updates).',
    'ETSI EN 303 645, *Cyber Security for Consumer Internet of Things: Baseline Requirements*, the provisions on software updates.'
  ],
  sim: 'ds-rollback'
}
);
