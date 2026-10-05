/* HYPER-CORE · esp32-api.js
 *
 * The software versions Hyper ESP32 is written for, and the API forms that have been replaced — so the validator
 * can warn when a program on a page uses one (Hyper.code.STALE, read by Hyper.code.lint).
 *
 * The baseline, checked against the projects' own sources on 2026-10-04 (HYPER-ESP32/API-CRIB.md has the detail):
 *   Arduino C++   arduino-esp32 core 3.3.x (ESP-IDF 5.5)        MicroPython 1.29
 *   ESP-IDF       v5.5 / v6.1 driver names                      LVGL 9 · ArduinoJson 7
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const E = H.esp = H.esp || {};
  const C = H.code;

  E.VERSIONS = {
    asOf: '2026-10-04',
    arduino: { name: 'Arduino core for ESP32 (arduino-esp32)', version: '3.3.12', note: 'built on ESP-IDF 5.5; a 4.0 pre-release on ESP-IDF 6.1 exists' },
    idf: { name: 'ESP-IDF', version: '6.1', note: 'the 5.5 line is still maintained and is what the Arduino core and MicroPython build on' },
    micropython: { name: 'MicroPython', version: '1.29', note: 'official builds for ESP32, S2, S3, C2, C3, C5, C6, H2 and P4' },
    circuitpython: { name: 'CircuitPython', version: '10.3', note: 'S2 and S3 stable; ESP32 and C3 beta; C2, C6, H2, P4 alpha' },
    esptool: { name: 'esptool', version: '5.4', note: 'commands are hyphenated since v5: write-flash, erase-flash' },
    lvgl: { name: 'LVGL', version: '9.6', note: '' },
    arduinojson: { name: 'ArduinoJson', version: '7.4', note: '' },
    platformio: { name: 'PlatformIO', version: 'espressif32 7.1', note: 'the official platform still ships Arduino core 2.x; the pioarduino fork carries core 3.x' }
  };

  if (!C) return;
  const cpp = (re, msg) => C.STALE.push(['cpp', re, msg]);
  const py = (re, msg) => C.STALE.push(['python', re, msg]);

  /* ---- Arduino core 2.x forms that core 3.x replaced */
  cpp(/\bledcSetup\s*\(|\bledcAttachPin\s*\(/, 'ledcSetup / ledcAttachPin are core 2.x: in core 3.x write ledcAttach(pin, freq, bits) and ledcWrite(pin, duty)');
  cpp(/\btimerBegin\s*\(\s*\d+\s*,\s*\d+\s*,/, 'timerBegin(num, prescaler, countUp) is core 2.x: in core 3.x write timerBegin(frequency), timerAttachInterrupt(t, fn), timerAlarm(t, value, reload, count)');
  cpp(/\btimerAlarmWrite\s*\(|\btimerAlarmEnable\s*\(/, 'timerAlarmWrite / timerAlarmEnable are core 2.x: in core 3.x write timerAlarm(t, value, reload, count)');
  cpp(/\bneopixelWrite\s*\(/, 'neopixelWrite is deprecated: write rgbLedWrite(pin, r, g, b)');
  cpp(/#\s*include\s*<I2S\.h>/, 'I2S.h was removed in core 3.x: include ESP_I2S.h and declare I2SClass i2s;');
  cpp(/\bhallRead\s*\(/, 'hallRead() was removed: the ESP32 Hall sensor is no longer supported');
  cpp(/\bStaticJsonDocument\b|\bDynamicJsonDocument\b/, 'StaticJsonDocument / DynamicJsonDocument are ArduinoJson 6: in version 7 write JsonDocument doc;');
  cpp(/\.memoryUsage\s*\(|\bJSON_(OBJECT|ARRAY|STRING)_SIZE\s*\(/, 'memoryUsage() and the JSON_…_SIZE() macros were removed in ArduinoJson 7: the document grows by itself; measure the free heap instead');
  cpp(/esp_now_register_recv_cb[\s\S]{0,400}?\(\s*const\s+uint8_t\s*\*\s*mac(_addr)?\s*,\s*const\s+uint8_t\s*\*/, 'the ESP-NOW receive callback is (const esp_now_recv_info_t *info, const uint8_t *data, int len) in core 3.x');
  cpp(/void\s+\w+\s*\(\s*const\s+uint8_t\s*\*\s*mac(_addr)?\s*,\s*esp_now_send_status_t/, 'the ESP-NOW send callback is (const esp_now_send_info_t *info, esp_now_send_status_t status) since ESP-IDF 5.5 (core 3.3)');
  cpp(/\bARDUINO_ISR_ATTR\b/, 'write IRAM_ATTR on interrupt handlers: ARDUINO_ISR_ATTR is empty unless a build option is set');
  cpp(/\bSPIFFS\s*\.\s*begin\b|#\s*include\s*["<]SPIFFS\.h[">]/, 'SPIFFS is deprecated: use LittleFS (same calls, LittleFS.begin(true))');
  cpp(/\btouchSetCycles\s*\(/, 'touchSetCycles was replaced by touchSetTiming in core 3.3');
  cpp(/\besp_sleep_enable_ext1_wakeup\s*\(/, 'write esp_sleep_enable_ext1_wakeup_io(mask, mode): the older name is deprecated');
  cpp(/\bADC_12db\b/, 'the Arduino attenuation constant is ADC_11db');
  cpp(/\bWiFiClientSecure\b/, 'core 3.x names it NetworkClientSecure (WiFiClientSecure still works as an alias): prefer the new name');
  /* ---- LVGL 8 forms that LVGL 9 renamed */
  cpp(/\blv_disp_drv_t\b|\blv_disp_draw_buf_t\b|\blv_disp_drv_register\b|\blv_indev_drv_t\b/, 'lv_disp_drv_t / lv_indev_drv_t are LVGL 8: in LVGL 9 write lv_display_create(), lv_display_set_flush_cb(), lv_display_set_buffers(), lv_indev_create()');
  cpp(/\blv_btn_create\s*\(|\blv_scr_act\s*\(|\blv_scr_load\s*\(/, 'lv_btn_create / lv_scr_act / lv_scr_load are LVGL 8 names: LVGL 9 writes lv_button_create, lv_screen_active, lv_screen_load');
  /* ---- legacy ESP-IDF drivers removed in v6.0 */
  cpp(/\badc1_get_raw\s*\(|\badc1_config_width\s*\(|\badc1_config_channel_atten\s*\(|#\s*include\s*["<]driver\/adc\.h[">]/, 'the legacy ADC driver was removed in ESP-IDF 6: use esp_adc/adc_oneshot.h (adc_oneshot_new_unit, adc_oneshot_read)');
  cpp(/\bi2c_cmd_link_create\s*\(|\bi2c_master_cmd_begin\s*\(/, 'the legacy I2C driver is end-of-life: use driver/i2c_master.h (i2c_new_master_bus, i2c_master_transmit_receive)');
  cpp(/#\s*include\s*["<]driver\/(timer|rmt|pcnt|mcpwm|dac|i2s)\.h[">]/, 'this legacy driver header was removed in ESP-IDF 6: use gptimer.h, rmt_tx.h / rmt_rx.h, pulse_cnt.h, mcpwm_prelude.h, dac_oneshot.h, i2s_std.h');
  cpp(/\btcpip_adapter_\w+\s*\(/, 'tcpip_adapter was replaced by esp_netif');

  /* ---- MicroPython */
  py(/^\s*import\s+u(time|os|json|socket|struct|binascii|hashlib|re|select|ssl|random|asyncio|io|errno|collections)\b/m, 'the u-prefixed module names are old: import time, os, json, socket … (import asyncio, not uasyncio)');
  py(/^\s*(import\s+urequests|from\s+urequests\s+import)/m, 'write import requests (it is built into the firmware)');
  py(/\bnetwork\.AUTH_\w+/, 'the AUTH_* constants are gone: write network.WLAN.SEC_WPA2 and the like');
  py(/\.irq\s*\([^)]*\bhard\s*=/, 'Pin.irq has no hard= argument on the ESP32 port');
  py(/\bmachine\.CAN\b|\besp32\.CAN\b|\bfrom\s+machine\s+import[^\n]*\bCAN\b/, 'official MicroPython for ESP32 has no CAN class: say so in na, or drive the TWAI controller from C++');
  py(/\bduty\s*\(\s*\d+\s*\)/, 'prefer duty_u16() (0–65535), which is the same on every port; duty() is the 10-bit form of the ESP32 port');
})(typeof window !== 'undefined' ? window : globalThis);
