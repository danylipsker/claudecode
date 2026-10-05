/* HYPER-CORE · espcode.js
 *
 * Programs on a page, three ways (Hyper ESP32): Arduino C++, MicroPython and Scratch-style blocks.
 *
 *   Hyper.code.highlight(src, lang) -> HTML          lang: cpp c python yaml json sh ini text
 *   Hyper.code.pre(src, lang)       -> '<pre class="code">…</pre>'
 *   Hyper.code.blocks.parse(src)    -> { scripts: [...], errors: [...] }     the block notation as a tree
 *   Hyper.code.blocks.html(src)     -> the blocks drawn (nested, coloured by category)
 *   Hyper.code.check(entry)         -> ['problem', ...]   a concept's code entry { title, cpp, py, blocks, ... }
 *   Hyper.code.lint(src, lang)      -> ['warning', ...]   API forms that are out of date
 *
 * The block notation (one block per line; `end` closes a C-shaped block; a blank line starts a new script):
 *
 *   when started                              a hat block: "when …" or "define …" starts a script
 *   set pin (2) as [output v]                 (…) a number or a reporter, [… v] a menu, [text] a text slot
 *   forever                                   C blocks: forever · repeat (10) · repeat until <…> · while <…>
 *     if <(read pin (0)) = [LOW v]> then          · if <…> then … else … · for each [x v] in (list)
 *       set pin (2) to [HIGH v]               <…> a condition (true or false)
 *     else
 *       set pin (2) to [LOW v]
 *     end
 *     wait (0.5) seconds                      // a comment after two slashes
 *   end
 *
 * A block's colour comes from its first words (set pin → pins, connect to Wi-Fi → wifi …) or from a category
 * written after two colons:  publish (t) to topic [home/temp]  :: mqtt
 * Inside a condition, < and > with a space on their inner side are comparisons:  <(t) > (30)>.
 *
 * Nothing here touches the DOM, so tools/validate.js can load it under Node.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const C = H.code = {};
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ================================================================ highlighting */
  const words = s => new Set(s.split(/\s+/).filter(Boolean));
  const CPP_KW = words(`alignas alignof auto bool break case catch char class const constexpr const_cast continue default delete do double
    dynamic_cast else enum explicit extern false float for friend goto if inline int long namespace new noexcept nullptr operator
    private protected public register reinterpret_cast return short signed sizeof static static_cast struct switch template this throw
    true try typedef typename union unsigned using virtual void volatile while override final NULL`);
  const CPP_TYPE = words(`uint8_t uint16_t uint32_t uint64_t int8_t int16_t int32_t int64_t size_t byte word boolean String string
    esp_err_t TaskHandle_t QueueHandle_t SemaphoreHandle_t TickType_t BaseType_t gpio_num_t hw_timer_t File IPAddress
    lv_obj_t lv_display_t lv_indev_t lv_event_t lv_style_t`);
  const CPP_CONST = words(`HIGH LOW INPUT OUTPUT INPUT_PULLUP INPUT_PULLDOWN OUTPUT_OPEN_DRAIN RISING FALLING CHANGE LED_BUILTIN
    IRAM_ATTR RTC_DATA_ATTR PROGMEM ESP_OK ESP_FAIL pdTRUE pdFALSE pdPASS portMAX_DELAY WIFI_STA WIFI_AP WIFI_AP_STA WL_CONNECTED
    SERIAL_8N1 MSBFIRST LSBFIRST SPI_MODE0 SPI_MODE1 SPI_MODE2 SPI_MODE3 PI`);
  const PY_KW = words(`False None True and as assert async await break class continue def del elif else except finally for from global if
    import in is lambda nonlocal not or pass raise return try while with yield`);
  const PY_BUILTIN = words(`print len range int float str bytes bytearray list dict set tuple bool open min max sum abs round sorted
    enumerate zip map filter isinstance hasattr getattr setattr type super object Exception OSError ValueError KeyError const memoryview hex bin ord chr`);

  const span = (cls, s) => '<span class="' + cls + '">' + esc(s) + '</span>';

  function hlCpp(src) {
    let out = '', i = 0;
    const n = src.length;
    while (i < n) {
      const c = src[i], d = src[i + 1];
      if (c === '/' && d === '/') { let j = src.indexOf('\n', i); if (j < 0) j = n; out += span('tk-c', src.slice(i, j)); i = j; continue; }
      if (c === '/' && d === '*') { let j = src.indexOf('*/', i + 2); j = j < 0 ? n : j + 2; out += span('tk-c', src.slice(i, j)); i = j; continue; }
      if (c === '#' && /^[ \t]*$/.test(src.slice(src.lastIndexOf('\n', i - 1) + 1, i))) {
        // a preprocessor line: #include <WiFi.h>, #define LED 2
        let j = src.indexOf('\n', i); if (j < 0) j = n;
        const line = src.slice(i, j);
        const m = /^(#\s*\w+)(\s*)(<[^>]*>|"[^"]*")?(.*)$/.exec(line);
        if (m) {
          const cm = m[4].indexOf('//');
          out += span('tk-p', m[1]) + esc(m[2]) + (m[3] ? span('tk-s', m[3]) : '') + (cm >= 0 ? hlCpp(m[4].slice(0, cm)) + span('tk-c', m[4].slice(cm)) : hlCpp(m[4]));
        } else out += span('tk-p', line);
        i = j; continue;
      }
      if (c === '"' || c === "'") {
        let j = i + 1;
        while (j < n && src[j] !== c && src[j] !== '\n') { if (src[j] === '\\') j++; j++; }
        j = Math.min(n, j + 1);
        out += span('tk-s', src.slice(i, j)); i = j; continue;
      }
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(d || ''))) {
        const m = /^(0[xX][0-9a-fA-F']+|0[bB][01']+|[0-9][0-9']*\.?[0-9]*(?:[eE][-+]?[0-9]+)?)[uUlLfF]*/.exec(src.slice(i));
        out += span('tk-n', m[0]); i += m[0].length; continue;
      }
      if (/[A-Za-z_]/.test(c)) {
        const m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i))[0];
        let k = i + m.length;
        while (src[k] === ' ') k++;
        const cls = CPP_KW.has(m) ? 'tk-k' : CPP_TYPE.has(m) || /_t$/.test(m) ? 'tk-t' : CPP_CONST.has(m) || /^[A-Z][A-Z0-9_]{2,}$/.test(m) ? 'tk-o' : src[k] === '(' ? 'tk-f' : '';
        out += cls ? span(cls, m) : esc(m);
        i += m.length; continue;
      }
      out += esc(c); i++;
    }
    return out;
  }

  function hlPy(src) {
    let out = '', i = 0;
    const n = src.length;
    while (i < n) {
      const c = src[i];
      if (c === '#') { let j = src.indexOf('\n', i); if (j < 0) j = n; out += span('tk-c', src.slice(i, j)); i = j; continue; }
      const sm = /^(?:[rRbBfFuU]{0,2})("""|'''|"|')/.exec(src.slice(i));
      if (sm && (i === 0 || !/[A-Za-z0-9_]/.test(src[i - 1]))) {
        const q = sm[1];
        let j = i + sm[0].length;
        if (q.length === 3) { const e = src.indexOf(q, j); j = e < 0 ? n : e + 3; }
        else { while (j < n && src[j] !== q && src[j] !== '\n') { if (src[j] === '\\') j++; j++; } j = Math.min(n, j + 1); }
        out += span('tk-s', src.slice(i, j)); i = j; continue;
      }
      if (c === '@' && /^[ \t]*$/.test(src.slice(src.lastIndexOf('\n', i - 1) + 1, i))) {
        const m = /^@[\w.]+/.exec(src.slice(i)); if (m) { out += span('tk-p', m[0]); i += m[0].length; continue; }
      }
      if (/[0-9]/.test(c)) {
        const m = /^(0[xX][0-9a-fA-F_]+|0[bB][01_]+|[0-9][0-9_]*\.?[0-9]*(?:[eE][-+]?[0-9]+)?)/.exec(src.slice(i));
        out += span('tk-n', m[0]); i += m[0].length; continue;
      }
      if (/[A-Za-z_]/.test(c)) {
        const m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i))[0];
        const cls = PY_KW.has(m) ? 'tk-k' : PY_BUILTIN.has(m) && src[i + m.length] === '(' ? 'tk-t' : /^[A-Z][A-Z0-9_]{2,}$/.test(m) ? 'tk-o' : src[i + m.length] === '(' ? 'tk-f' : '';
        out += cls ? span(cls, m) : esc(m);
        i += m.length; continue;
      }
      out += esc(c); i++;
    }
    return out;
  }

  // yaml (ESPHome), ini (platformio.ini, sdkconfig), sh (commands), json
  function hlLines(src, lang) {
    return src.split('\n').map(line => {
      if (lang === 'json') return esc(line).replace(/(&quot;|")((?:[^"\\]|\\.)*)("|&quot;)(\s*:)?/g, (m, a, s, b, colon) => '<span class="' + (colon ? 'tk-k' : 'tk-s') + '">"' + s + '"</span>' + (colon || '')).replace(/\b(-?\d+\.?\d*(?:[eE][-+]?\d+)?|true|false|null)\b(?![^<]*<\/span>)/g, '<span class="tk-n">$1</span>');
      const hash = (() => { let q = null; for (let k = 0; k < line.length; k++) { const ch = line[k]; if (q) { if (ch === q) q = null; } else if (ch === '"' || ch === "'") q = ch; else if ((ch === '#' && (k === 0 || /\s/.test(line[k - 1]))) || (lang === 'ini' && ch === ';' && k === 0)) return k; } return -1; })();
      const code = hash >= 0 ? line.slice(0, hash) : line, com = hash >= 0 ? span('tk-c', line.slice(hash)) : '';
      if (lang === 'yaml') {
        const m = /^(\s*-?\s*)([A-Za-z_][\w.-]*)(:)(.*)$/.exec(code);
        if (m) return esc(m[1]) + span('tk-k', m[2]) + m[3] + hlVal(m[4]) + com;
        return hlVal(code) + com;
      }
      if (lang === 'ini') {
        if (/^\s*\[.*\]\s*$/.test(code)) return span('tk-p', code) + com;
        const m = /^(\s*[\w.-]+\s*)(=)(.*)$/.exec(code);
        if (m) return span('tk-k', m[1]) + m[2] + hlVal(m[3]) + com;
        return esc(code) + com;
      }
      if (lang === 'sh') {
        const m = /^(\s*(?:\$\s+|>\s+)?)([\w./-]+)(.*)$/.exec(code);
        if (m) return esc(m[1]) + span('tk-f', m[2]) + esc(m[3]).replace(/(\s)(--?[\w-]+)/g, '$1<span class="tk-o">$2</span>') + com;
      }
      return esc(code) + com;
    }).join('\n');
  }
  const hlVal = s => esc(s).replace(/("[^"]*"|'[^']*')/g, '<span class="tk-s">$1</span>').replace(/(^|[\s:[,])(-?\d+\.?\d*(?:ms|s|min|h|Hz|kHz|MHz|%)?|true|false|on|off|yes|no)(?=$|[\s,\]])/gi, '$1<span class="tk-n">$2</span>');

  const LANGS = { cpp: 'cpp', 'c++': 'cpp', c: 'cpp', arduino: 'cpp', ino: 'cpp', idf: 'cpp', python: 'python', py: 'python', micropython: 'python',
    yaml: 'yaml', yml: 'yaml', json: 'json', sh: 'sh', bash: 'sh', shell: 'sh', console: 'sh', ini: 'ini', text: 'text', txt: 'text', '': 'text', blocks: 'blocks' };
  C.lang = l => LANGS[String(l || '').toLowerCase()] || 'text';
  C.highlight = function (src, lang) {
    const L = C.lang(lang);
    src = String(src == null ? '' : src);
    return L === 'cpp' ? hlCpp(src) : L === 'python' ? hlPy(src) : L === 'text' ? esc(src) : hlLines(src, L);
  };
  /* tidy a template-literal program: drop the first and last blank lines and the common indent */
  C.dedent = function (src) {
    let lines = String(src == null ? '' : src).replace(/\r\n?/g, '\n').replace(/\t/g, '    ').split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    const ind = Math.min(...lines.filter(l => l.trim()).map(l => /^ */.exec(l)[0].length));
    if (Number.isFinite(ind) && ind > 0) lines = lines.map(l => l.slice(ind));
    return lines.map(l => l.replace(/\s+$/, '')).join('\n');
  };
  C.pre = function (src, lang) {
    const L = C.lang(lang);
    if (L === 'blocks') return C.blocks.html(src);
    return '<pre class="code lang-' + L + '"><code>' + C.highlight(C.dedent(src), L) + '</code></pre>';
  };

  /* ================================================================ blocks */
  const B = C.blocks = {};

  /* categories: [id, name, hue] — the colours of the palette */
  B.CATEGORIES = [
    ['events', 'Events', 46], ['control', 'Control', 32], ['pins', 'Pins', 212], ['sensing', 'Sensors', 190], ['operators', 'Operators', 128],
    ['variables', 'Variables', 20], ['serial', 'Serial', 172], ['time', 'Time', 54], ['wifi', 'Wi-Fi', 200], ['net', 'Internet', 226],
    ['mqtt', 'MQTT', 268], ['ble', 'Bluetooth', 238], ['radio', 'ESP-NOW and radio', 286], ['display', 'Display', 304], ['sound', 'Sound', 322],
    ['motion', 'Motors', 252], ['light', 'Lights', 338], ['storage', 'Storage', 96], ['power', 'Power and sleep', 150], ['state', 'State machine', 2],
    ['tasks', 'Tasks', 74], ['my', 'My blocks', 346], ['bus', 'Buses', 164], ['cloud', 'Cloud', 218], ['security', 'Security', 12], ['ai', 'AI', 280]
  ];
  const CAT = new Map(B.CATEGORIES.map(c => [c[0], c]));
  B.hue = id => (CAT.get(id) || CAT.get('my'))[2];

  /* the first words of a block decide its category (longest match wins); a writer can override with ":: category" */
  const RULES = [
    ['events', 'when'],
    ['control', 'forever|repeat|if|else|while|for each|for|wait until|stop|break|continue|return|call|run|do nothing|restart|try|on error'],
    ['time', 'wait|delay|every|timer|milliseconds since|millis|micros|seconds since|current time|time now|get time|set time|sync time|start timer|reset timer|timer value|elapsed'],
    ['pins', 'set pin|read pin|digital|analog|pwm|set pwm|touch|toggle pin|pulse pin|attach interrupt|detach interrupt|set dac|dac|configure pin|pin|adc'],
    ['sensing', 'read sensor|read temperature|read humidity|read pressure|read distance|read light|read|temperature|humidity|distance|button|encoder|scan i2c|measure'],
    ['variables', 'set \\[|change \\[|add|remove|delete|insert|replace item|item|length of|make list|make a|clear list|show variable'],
    ['operators', 'join|map|constrain|round|random|abs|sqrt|min|max|not|text of|number from|split|letter|contains|convert|format|to json|from json|parse'],
    ['serial', 'print|serial|start serial|log|write line|read line'],
    ['wifi', 'connect to wi-fi|connect wi-fi|wi-fi|wifi|start access point|scan networks|disconnect wi-fi|signal strength|ip address|start provisioning'],
    ['net', 'http|get url|post|send request|start web server|web server|serve|respond|websocket|udp|tcp|open socket|fetch|ntp|send email|send telegram|mdns|on request'],
    ['mqtt', 'mqtt|publish|subscribe|connect to broker|connect to mqtt'],
    ['ble', 'ble|bluetooth|advertise|start advertising|notify|add service|add characteristic|start scan|connect to device'],
    ['radio', 'esp-now|espnow|send to peer|add peer|broadcast|lora|zigbee|thread|matter|send packet|radio'],
    ['display', 'display|show|draw|clear screen|clear display|print at|set cursor|fill|lcd|oled|tft|update display|set font|set text|create button|create label|create slider|create|set brightness|screen|widget|load screen|set label|on touch|touch point'],
    ['sound', 'play|tone|beep|stop sound|buzzer|speak|record|set volume|listen'],
    ['motion', 'servo|set servo|motor|set motor|stepper|step|move|turn|drive|home|stop motor|set speed|enable driver'],
    ['light', 'led|set led|neopixel|set pixel|pixels|fill pixels|show pixels|fade|blink|rgb|set colour|set color|strip'],
    ['storage', 'save|load|store|write file|read file|append|open file|close file|preferences|remember|recall|erase|mount|list files|log to'],
    ['power', 'deep sleep|light sleep|sleep|wake|battery|go to sleep|enable wake|set cpu|brownout|power'],
    ['state', 'go to state|state|set state|in state|enter state|on entry|on exit|transition|on event|raise event'],
    ['tasks', 'start task|task|create task|queue|send to queue|receive from queue|take|give|lock|unlock|notify task|mutex|semaphore'],
    ['bus', 'i2c|spi|uart|can|twai|one-wire|onewire|modbus|rs-485|write register|read register|write bytes|read bytes|send bytes|usb'],
    ['cloud', 'cloud|upload|send to cloud|report|sync|ota|check for update|update firmware|dashboard|datapoint|send data'],
    ['security', 'encrypt|decrypt|sign|verify|hash|certificate|secure|generate key|random bytes'],
    ['ai', 'classify|detect|recognise|recognize|run model|infer|wake word|ask model|capture|take photo|camera']
  ].map(([cat, alt]) => [cat, alt.split('|')]);
  const RULE_LIST = [];
  for (const [cat, alts] of RULES) for (const a of alts) RULE_LIST.push([a, cat]);
  RULE_LIST.sort((x, y) => y[0].length - x[0].length);
  // when the first words say nothing, a telling word anywhere in the block decides
  const HINTS = [['radio', /esp-now|\bpeer\b|\blora\b|zigbee|thread\b/], ['mqtt', /mqtt|\btopic\b/], ['wifi', /wi-fi|wifi/], ['ble', /\bble\b|bluetooth|characteristic|advertis/], ['display', /display|screen|\blcd\b|oled|\btft\b|widget/],
    ['bus', /\bi2c\b|\bspi\b|\buart\b|\bcan\b|register/], ['storage', /\bfile\b|preferences|\bnvs\b|sd card/], ['state', /\bstate\b|\bevent\b/], ['tasks', /queue|\btask\b|mutex|semaphore/], ['light', /pixel|\bled\b|colour|color/],
    ['motion', /servo|motor|stepper/], ['sound', /tone|sound|speaker|audio/], ['power', /sleep|battery|wake/], ['net', /http|\burl\b|\bweb\b|request|socket/], ['serial', /serial/], ['sensing', /sensor|temperature|humidity/],
    ['time', /seconds|milliseconds|\btime\b|\btimer\b/], ['pins', /\bpin\b|\bgpio\b|\badc\b|pwm/], ['cloud', /cloud|\bota\b|update/], ['security', /encrypt|certificate|\bkey\b|secure/], ['ai', /classif|inference|camera|photo|wake word/]];
  function direct(s) {
    for (const [a, cat] of RULE_LIST) {
      if (a.endsWith('\\[')) { if (s.startsWith(a.slice(0, -2) + '[')) return cat; }
      else if (s === a || s.startsWith(a + ' ') || s.startsWith(a + '(') || s.startsWith(a + '[') || s.startsWith(a + '?')) return cat;
    }
    return null;
  }
  B.categoryOf = function (label) {
    const s = label.toLowerCase().replace(/\s+/g, ' ').trim();
    if (/^define\b/.test(s)) return 'my';
    const d = direct(s);
    // "when …" is always an event; for "start display", "stop motor", "enable wake" the thing named decides
    if (d === 'events') return d;
    const rest = s.replace(/^(start|stop|begin|end|enable|disable|init|set up|setup|open|close)\s+/, '');
    const d2 = rest !== s ? direct(rest) : null;
    if (d2 && (!d || d === 'control')) return d2;
    if (d) return d;
    const words = s.replace(/\[[^\]]*\]/g, ' ');           // not the text typed into slots
    for (const [cat, re] of HINTS) if (re.test(words)) return cat;
    return 'my';
  };

  /* ---- parsing one line into parts: text, (reporter), <boolean>, [menu v], [text] */
  function parseParts(s, errs) {
    let i = 0;
    const n = s.length;
    function seq(close) {
      const parts = [];
      let buf = '';
      const flush = () => { if (buf) { parts.push({ t: 'text', v: buf }); buf = ''; } };
      while (i < n) {
        const c = s[i];
        if (c === '\\' && i + 1 < n) { buf += s[i + 1]; i += 2; continue; }
        if (close && c === close) {
          // inside a condition a ">" with a space before it is "greater than", not the end
          if (close === '>' && i > 0 && s[i - 1] === ' ') { buf += c; i++; continue; }
          i++; flush(); return parts;
        }
        if (c === '(') { i++; flush(); parts.push({ t: 'round', parts: seq(')') }); continue; }
        if (c === '[') {
          i++; flush();
          const j = s.indexOf(']', i);
          if (j < 0) { errs.push('a "[" is never closed'); buf = s.slice(i); i = n; flush(); return parts; }
          let v = s.slice(i, j); i = j + 1;
          const menu = /\s+v$/.test(v);
          if (menu) v = v.replace(/\s+v$/, '');
          parts.push({ t: menu ? 'menu' : 'input', v });
          continue;
        }
        if (c === '<' && i + 1 < n && s[i + 1] !== ' ' && s[i + 1] !== '=') { i++; flush(); parts.push({ t: 'bool', parts: seq('>') }); continue; }
        if ((c === ')' || c === ']') && !close) { errs.push('a "' + c + '" has no opening bracket'); i++; continue; }
        if (c === ')' && close && close !== ')') { errs.push('a ")" where "' + close + '" was expected'); i++; continue; }
        buf += c; i++;
      }
      if (close) errs.push('a "' + (close === ')' ? '(' : '<') + '" is never closed');
      flush();
      return parts;
    }
    const parts = seq(null);
    // tidy the text pieces
    (function tidy(ps) { for (const p of ps) { if (p.t === 'text') p.v = p.v.replace(/\s+/g, ' '); else if (p.parts) tidy(p.parts); } })(parts);
    return parts;
  }
  const labelOf = parts => parts.map(p => p.t === 'text' ? p.v : p.t === 'round' ? '(' + labelOf(p.parts) + ')' : p.t === 'bool' ? '<' + labelOf(p.parts) + '>' : '[' + p.v + ']').join('');

  const C_OPEN = /^(forever|repeat\b|while\b|if\b.*\bthen$|for each\b|for\b.*\bdo$|try$|in state\b|on entry$|on exit$|every\b.*\bdo$|with\b.*\bdo$)/i;

  B.parse = function (src) {
    const errors = [];
    const scripts = [];
    let script = null;
    const stack = [];          // open C blocks
    const lines = C.dedent(src).split('\n');
    const newScript = () => { script = { blocks: [] }; scripts.push(script); stack.length = 0; };
    const target = () => stack.length ? stack[stack.length - 1].cur : script.blocks;
    lines.forEach((raw, ln) => {
      let line = raw.trim();
      if (!line) { if (stack.length === 0) script = null; return; }
      let comment = '';
      const cm = /(^|\s)\/\/\s?(.*)$/.exec(line);
      if (cm) { comment = cm[2]; line = line.slice(0, cm.index).trim(); }
      if (!line) { if (!script) newScript(); target().push({ kind: 'note', text: comment }); return; }
      let cat = null;
      const cc = /\s*::\s*([a-z]+)\s*$/.exec(line);
      if (cc) { cat = cc[1]; line = line.slice(0, cc.index).trim(); if (!CAT.has(cat)) { errors.push('line ' + (ln + 1) + ': unknown category "' + cat + '"'); cat = null; } }
      const lower = line.toLowerCase();
      if (lower === 'end') {
        if (!stack.length) { errors.push('line ' + (ln + 1) + ': "end" with nothing to close'); return; }
        stack.pop(); return;
      }
      if (lower === 'else' || /^else if\b.*\bthen$/.test(lower)) {
        const top = stack[stack.length - 1];
        if (!top || top.block.head !== 'if') { errors.push('line ' + (ln + 1) + ': "else" without an "if"'); return; }
        const errs = [];
        const arm = { parts: parseParts(line, errs), body: [] };
        errs.forEach(e => errors.push('line ' + (ln + 1) + ': ' + e));
        top.block.arms.push(arm); top.cur = arm.body; return;
      }
      const errs = [];
      const parts = parseParts(line, errs);
      errs.forEach(e => errors.push('line ' + (ln + 1) + ': ' + e));
      const label = labelOf(parts);
      const isHat = /^(when|define)\b/i.test(lower) || (/^every\b/i.test(lower) && !/\bdo$/i.test(lower) && !stack.length);   // "every (5) seconds" is an event; "every (5) seconds do … end" a C block
      if (isHat) {
        if (stack.length) { errors.push('line ' + (ln + 1) + ': "' + line.slice(0, 30) + '" starts a script inside an open block (missing "end"?)'); stack.length = 0; }
        newScript();
        script.blocks.push({ kind: 'hat', parts, cat: cat || B.categoryOf(label), comment });
        return;
      }
      if (!script) newScript();
      if (C_OPEN.test(lower)) {
        const head = /^if\b/.test(lower) ? 'if' : 'c';
        const block = { kind: 'c', head, parts, cat: cat || B.categoryOf(label), arms: [{ parts: null, body: [] }], comment };
        target().push(block);
        stack.push({ block, cur: block.arms[0].body, line: ln + 1 });
        return;
      }
      target().push({ kind: 'stack', parts, cat: cat || B.categoryOf(label), comment });
    });
    for (const s of stack) errors.push('line ' + s.line + ': this block is never closed with "end"');
    return { scripts: scripts.filter(s => s.blocks.length), errors };
  };

  /* ---- drawing: nested HTML, styled by hyper.css (.sb …) */
  function partsHtml(parts, cat) {
    return parts.map(p => {
      if (p.t === 'text') return esc(p.v);
      if (p.t === 'menu') return '<span class="sb-m">' + esc(p.v) + '</span>';
      if (p.t === 'input') return '<span class="sb-i">' + esc(p.v) + '</span>';
      const inner = p.parts;
      // a round slot holding only a number or a short word is an input; otherwise a reporter block of its own colour
      const only = inner.length === 1 && inner[0].t === 'text' ? inner[0].v.trim() : null;
      if (p.t === 'round' && only != null && /^-?[\d.,:x]+[\w%°]*$|^$/.test(only)) return '<span class="sb-n">' + esc(only) + '</span>';
      const label = labelOf(inner);
      let c = cat;
      if (p.t === 'round' && only != null && /^[\w .'-]+$/.test(only) && B.categoryOf(only) === 'my') c = 'variables';
      else if (/(^|\s)(=|≠|!=|<|>|≤|≥|<=|>=|\+|-|\*|\/|×|÷|mod|and|or|not)(\s|$)/.test(inner.filter(x => x.t === 'text').map(x => x.v).join(' ')) ) c = 'operators';
      else { const k = B.categoryOf(label); c = k === 'my' ? (p.t === 'bool' ? 'sensing' : 'variables') : k; }
      return '<span class="' + (p.t === 'bool' ? 'sb-h' : 'sb-r') + '" style="--sh:' + B.hue(c) + '">' + partsHtml(inner, c) + '</span>';
    }).join('');
  }
  const note = t => t ? '<span class="sb-note">' + esc(t) + '</span>' : '';
  function blockHtml(b) {
    if (b.kind === 'note') return '<div class="sb-line"><span class="sb-note solo">' + esc(b.text) + '</span></div>';
    const st = ' style="--sh:' + B.hue(b.cat) + '"';
    if (b.kind === 'c') {
      let h = '<div class="sb-c"' + st + '>';
      b.arms.forEach((arm, i) => {
        h += '<div class="sb-line"><div class="sb-b sb-ch' + (i ? ' sb-else' : '') + '">' + partsHtml(i ? arm.parts : b.parts, b.cat) + '</div>' + (i ? '' : note(b.comment)) + '</div>' +
          '<div class="sb-body">' + (arm.body.length ? arm.body.map(blockHtml).join('') : '<div class="sb-empty"></div>') + '</div>';
      });
      return h + '<div class="sb-b sb-foot"></div></div>';
    }
    return '<div class="sb-line"><div class="sb-b' + (b.kind === 'hat' ? ' sb-hat' : '') + '"' + st + '>' + partsHtml(b.parts, b.cat) + '</div>' + note(b.comment) + '</div>';
  }
  B.html = function (src) {
    const p = typeof src === 'string' ? B.parse(src) : src;
    return '<div class="sb">' + p.scripts.map(s => '<div class="sb-script">' + s.blocks.map(blockHtml).join('') + '</div>').join('') +
      (p.errors.length ? '<div class="sb-err">' + p.errors.map(esc).join('<br>') + '</div>' : '') + '</div>';
  };
  /* every block of a program, flat: [{ label, cat, kind, depth }] — for counting and for tests */
  B.flat = function (src) {
    const p = typeof src === 'string' ? B.parse(src) : src, out = [];
    (function walk(bs, depth) {
      for (const b of bs) {
        if (b.kind === 'note') continue;
        out.push({ label: labelOf(b.parts), cat: b.cat, kind: b.kind, depth });
        if (b.kind === 'c') b.arms.forEach(a => walk(a.body, depth + 1));
      }
    })(p.scripts.flatMap(s => s.blocks), 0);
    return out;
  };

  /* ================================================================ checking a page's programs */
  /* bracket and quote balance of C++ or Python: -> a problem, or '' */
  C.balance = function (src, lang) {
    const L = C.lang(lang), open = '([{', close = ')]}';
    const st = [];
    let i = 0, line = 1;
    const n = src.length;
    while (i < n) {
      const c = src[i], d = src[i + 1];
      if (c === '\n') { line++; i++; continue; }
      if (L === 'cpp' && c === '/' && d === '/') { while (i < n && src[i] !== '\n') i++; continue; }
      if (L === 'cpp' && c === '/' && d === '*') { const j = src.indexOf('*/', i + 2); if (j < 0) return 'a /* comment is never closed (line ' + line + ')'; line += src.slice(i, j).split('\n').length - 1; i = j + 2; continue; }
      if (L === 'python' && c === '#') { while (i < n && src[i] !== '\n') i++; continue; }
      // the #else / #elif branch of a conditional is an alternative text of the same code: skip it to its #endif
      if (L === 'cpp' && c === '#' && /^[ \t]*$/.test(src.slice(src.lastIndexOf('\n', i - 1) + 1, i)) && /^#\s*(else|elif)\b/.test(src.slice(i, i + 10))) {
        let depth = 0, j = i, first = true;
        while (j < n) {
          const e = src.indexOf('\n', j), ln = src.slice(j, e < 0 ? n : e);
          if (!first) { if (/^\s*#\s*if/.test(ln)) depth++; else if (/^\s*#\s*endif\b/.test(ln)) { if (depth === 0) break; depth--; } }
          first = false;
          if (e < 0) { j = n; break; }
          line++; j = e + 1;
        }
        i = j; continue;
      }
      if (L === 'cpp' && c === '#' && /^[ \t]*$/.test(src.slice(src.lastIndexOf('\n', i - 1) + 1, i)) && /^#\s*include/.test(src.slice(i, i + 12))) { while (i < n && src[i] !== '\n') i++; continue; }
      if (c === '"' || c === "'") {
        if (L === 'python' && src.slice(i, i + 3) === c + c + c) { const j = src.indexOf(c + c + c, i + 3); if (j < 0) return 'a triple-quoted string is never closed (line ' + line + ')'; line += src.slice(i, j).split('\n').length - 1; i = j + 3; continue; }
        // a C++ raw string R"( … )"
        if (L === 'cpp' && c === '"' && src[i - 1] === 'R') { const m = /^"([^(\s]*)\(/.exec(src.slice(i)); if (m) { const endTok = ')' + m[1] + '"', j = src.indexOf(endTok, i); if (j < 0) return 'a raw string is never closed (line ' + line + ')'; line += src.slice(i, j).split('\n').length - 1; i = j + endTok.length; continue; } }
        // C++ digit separators (1'000'000) are not character literals
        if (L === 'cpp' && c === "'" && /[0-9]/.test(src[i - 1] || '') && /[0-9]/.test(d || '')) { i++; continue; }
        let j = i + 1;
        while (j < n && src[j] !== c) { if (src[j] === '\\') j++; if (src[j] === '\n') return 'a string is not closed on line ' + line; j++; }
        if (j >= n) return 'a string is not closed on line ' + line;
        i = j + 1; continue;
      }
      const o = open.indexOf(c), k = close.indexOf(c);
      if (o >= 0) st.push([c, line]);
      else if (k >= 0) {
        const top = st.pop();
        if (!top) return 'a "' + c + '" on line ' + line + ' has no opening bracket';
        if (open.indexOf(top[0]) !== k) return 'a "' + top[0] + '" opened on line ' + top[1] + ' is closed by "' + c + '" on line ' + line;
      }
      i++;
    }
    if (st.length) return 'a "' + st[st.length - 1][0] + '" opened on line ' + st[st.length - 1][1] + ' is never closed';
    return '';
  };

  /* API forms that have been replaced: [language, pattern, what to write instead]. Filled in by esp32-api.js. */
  C.STALE = [];
  C.lint = function (src, lang) {
    const L = C.lang(lang), out = [];
    for (const [l, re, msg] of C.STALE) if (l === L && re.test(src)) out.push(msg);
    return out;
  };

  /* the languages a code entry may carry, in tab order */
  C.TABS = [['blocks', 'Blocks'], ['cpp', 'Arduino C++'], ['py', 'MicroPython'], ['idf', 'ESP-IDF (C)'], ['yaml', 'ESPHome']];
  C.langOfTab = { blocks: 'blocks', cpp: 'cpp', py: 'python', idf: 'cpp', yaml: 'yaml' };

  /* A concept's code entry: { title, about, needs, wiring: [[from, to], …], libs: […], cpp, py, blocks, idf, yaml, na: { py: 'why not' }, output, notes: […] }
     -> { errors: [...], warnings: [...] } */
  C.check = function (e) {
    const errors = [], warnings = [];
    if (!e || typeof e !== 'object') return { errors: ['a code entry is an object { title, cpp, py, blocks, … }'], warnings };
    const known = ['title', 'about', 'needs', 'wiring', 'libs', 'cpp', 'py', 'blocks', 'idf', 'yaml', 'na', 'output', 'notes', 'board'];
    for (const k of Object.keys(e)) if (!known.includes(k)) errors.push('unknown key "' + k + '" (' + known.join(', ') + ')');
    if (!e.title) errors.push('no title');
    const na = e.na || {};
    for (const k of Object.keys(na)) if (!C.langOfTab[k]) errors.push('na has an unknown language "' + k + '"');
    for (const [k, name] of [['cpp', 'Arduino C++'], ['py', 'MicroPython'], ['blocks', 'blocks']]) {
      if (e[k] == null && !na[k]) warnings.push('no ' + name + ' version: give ' + k + ', or say why there is none in na: { ' + k + ': "…" }');
      if (e[k] != null && na[k]) errors.push(k + ' is given and also marked not available');
    }
    for (const [k] of C.TABS) {
      const src = e[k];
      if (src == null) continue;
      if (typeof src !== 'string' || !src.trim()) { errors.push(k + ' must be the program text'); continue; }
      if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(src)) errors.push(k + ' contains a control character: a backslash escape such as \\n or \\t was swallowed by JavaScript — write the program inside String.raw`…`');
      if (k === 'blocks') {
        const p = B.parse(src);
        p.errors.forEach(x => errors.push('blocks ' + x));
        if (!p.scripts.length) errors.push('blocks: no block found');
        else if (p.scripts.every(s => s.blocks[0].kind !== 'hat')) warnings.push('blocks: no script starts with a hat block ("when started", "when …")');
      } else if (k === 'cpp' || k === 'py' || k === 'idf') {
        const bal = C.balance(C.dedent(src), C.langOfTab[k]);
        if (bal) errors.push(k + ': ' + bal);
        C.lint(src, C.langOfTab[k]).forEach(x => warnings.push(k + ': ' + x));
        if (k === 'py' && /\t/.test(src)) warnings.push('py: indent with spaces, not tabs');
        if (k === 'cpp' && /\bvoid\s+setup\s*\(/.test(src) !== /\bvoid\s+loop\s*\(/.test(src)) warnings.push('cpp: a sketch needs both setup() and loop()');
        if (k === 'idf' && !/\bapp_main\s*\(/.test(src) && src.split('\n').length > 12) warnings.push('idf: a complete ESP-IDF program has void app_main(void)');
      }
    }
    if (e.wiring != null && (!Array.isArray(e.wiring) || e.wiring.some(w => !Array.isArray(w) || w.length < 2))) errors.push('wiring is a list of [from, to] or [from, to, note] rows');
    return { errors, warnings };
  };
})(typeof window !== 'undefined' ? window : globalThis);
