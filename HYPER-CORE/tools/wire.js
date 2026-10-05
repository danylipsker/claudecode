/* Lists a discipline's content and simulation files in its index.html, in the order of the outline.
 *
 *   node HYPER-CORE/tools/wire.js HYPER-ESP32
 *
 * Rewrites the lines between "<!-- content -->" and "<!-- simulations -->", and between "<!-- simulations -->" and
 * the next comment, from the files that exist in content/ and sims/ (outline.js and reference.js first, then the
 * topics in outline order, then any other file). For Hyper ESP32 it also lists the labs (ui/esp-*.js) after
 * "<!-- labs -->". Line endings of the file are kept.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { makeContext, loadCore, run } = require('./load');

const dir = path.resolve(process.argv[2] || '');
const index = path.join(dir, 'index.html');
if (!fs.existsSync(index)) { console.error('No index.html in ' + dir); process.exit(2); }
let html = fs.readFileSync(index, 'utf8');
const nl = html.includes('\r\n') ? '\r\n' : '\n';

// the topics, in outline order
const ctx = makeContext();
const H = loadCore(ctx);
run(ctx, path.join(dir, 'content', 'outline.js'));
const topics = H.list.filter(n => n.kind === 'topic').map(n => n.id);
const order = f => { const b = f.replace(/\.js$/, ''); return b === 'outline' ? -2 : b === 'reference' ? -1 : topics.indexOf(b) >= 0 ? topics.indexOf(b) : 1e6; };
const list = sub => (fs.existsSync(path.join(dir, sub)) ? fs.readdirSync(path.join(dir, sub)).filter(f => f.endsWith('.js')).sort((a, b) => order(a) - order(b) || a.localeCompare(b)) : []);
const tags = (sub, files) => files.map(f => '<script src="' + sub + '/' + f + '"></script>').join(nl);

function between(startMark, lines) {
  const i = html.indexOf(startMark);
  if (i < 0) { console.error('Marker not found: ' + startMark); process.exit(2); }
  const from = i + startMark.length;
  const m = /\r?\n\s*\r?\n|\r?\n<!--/.exec(html.slice(from));          // up to the blank line or the next comment
  const to = m ? from + m.index : html.length;
  html = html.slice(0, from) + (lines ? nl + lines : '') + html.slice(to);
}
between('<!-- content -->', tags('content', list('content')));
between('<!-- simulations -->', tags('sims', list('sims')));
if (html.includes('<!-- labs -->')) {
  const uiDir = path.join(__dirname, '..', 'js', 'ui');
  const labs = fs.readdirSync(uiDir).filter(f => /^esp-[a-z]+\.js$/.test(f) && f !== 'esp-pinout.js').sort();
  between('<!-- labs -->', labs.map(f => '<script src="../HYPER-CORE/js/ui/' + f + '"></script>').join(nl));
}
fs.writeFileSync(index, html);
console.log(path.basename(dir) + '/index.html: ' + list('content').length + ' content files, ' + list('sims').length + ' simulation files');
