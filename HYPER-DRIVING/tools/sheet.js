#!/usr/bin/env node
/* Hyper Driving · tools/sheet.js — a contact sheet of signs, warning lights or
 * glyphs, rendered to PNG with a headless browser so a drawing can be checked
 * by eye (and by an agent, which can look at the PNG).
 *
 *   node tools/sheet.js signs --series 100 --out _sheets/s100.png
 *   node tools/sheet.js signs --nums 301,302,303 --size 200 --out _sheets/x.png
 *   node tools/sheet.js dash --out _sheets/dash.png
 *   node tools/sheet.js glyphs --out _sheets/glyphs.png
 *   node tools/sheet.js signs --file work/s100.json --out …   (draw signs from a work file instead of the pack)
 *
 * Options: --cols N (default 8), --size px (default 120), --lang he|en (default he),
 * --html only writes the HTML.
 * Uses Chrome or Edge in headless mode (paths below).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const kind = args[0] && !args[0].startsWith('--') ? args[0] : 'signs';
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : d; };
const size = +opt('size', 120), cols = +opt('cols', 8), LANG = opt('lang', 'he') === 'en' ? 'en' : 'he';
const out = path.resolve(opt('out', path.join(ROOT, '_sheets', kind + '.png')));
fs.mkdirSync(path.dirname(out), { recursive: true });

const pack = path.join(ROOT, 'content', 'il');
const signsFile = JSON.parse(fs.readFileSync(path.join(pack, 'signs.json'), 'utf8'));
let signs = signsFile.signs;
if (opt('file') && kind === 'signs') {
  const w = JSON.parse(fs.readFileSync(path.resolve(opt('file')), 'utf8'));
  const list = w.signs || w;
  const byNum = new Map(signs.map((s) => [String(s.num), s]));
  list.forEach((s) => byNum.set(String(s.num), Object.assign({}, byNum.get(String(s.num)) || {}, s)));
  signs = [...byNum.values()];
  if (w.glyphs) signsFile.glyphs = Object.assign({}, signsFile.glyphs || {}, w.glyphs);
  if (!opt('series') && !opt('nums')) signs = list.map((s) => byNum.get(String(s.num)));
}
if (opt('series')) signs = signs.filter((s) => String(s.series) === String(opt('series')));
if (opt('nums')) { const want = String(opt('nums')).split(','); signs = want.map((n) => signs.find((s) => String(s.num) === n)).filter(Boolean); }
const dash = JSON.parse(fs.readFileSync(path.join(pack, 'dash.json'), 'utf8')).lights;
let dashList = dash;
if (kind === 'dash' && opt('file')) {
  const w = JSON.parse(fs.readFileSync(path.resolve(opt('file')), 'utf8'));
  dashList = w.lights || w;
  if (w.glyphs) signsFile.glyphs = Object.assign({}, signsFile.glyphs || {}, w.glyphs);
}

let FIGS = {};
if (kind === 'figures') {
  const F = JSON.parse(fs.readFileSync(path.join(pack, 'figures.json'), 'utf8')).figures;
  Object.assign(FIGS, F);
  fs.readdirSync(pack).filter((n) => /^_new-figures-.*.json$/.test(n)).forEach((n) => Object.assign(FIGS, JSON.parse(fs.readFileSync(path.join(pack, n), 'utf8')).figures || {}));
  if (opt('grep')) Object.keys(FIGS).forEach((k) => { if (!k.includes(opt('grep'))) delete FIGS[k]; });
  if (opt('ids')) { const want = String(opt('ids')).split(','); Object.keys(FIGS).forEach((k) => { if (!want.includes(k)) delete FIGS[k]; }); }
  Object.keys(FIGS).forEach((k) => { if (FIGS[k].kind === 'widget') delete FIGS[k]; });
}
const scripts = ['config', 'core', 'i18n', 'content', 'icons', 'glyphs', 'signs', 'dash'].map((s) => `<script src="${path.join(ROOT, 'js', s + '.js').replace(/\\/g, '/')}"></script>`).join('\n');
const extraGlyphFiles = String(opt('glyphs', '')).split(',').filter(Boolean).map((f) => fs.readFileSync(path.resolve(f), 'utf8')).join('\n');
const html = `<!DOCTYPE html><html lang="${LANG}" dir="${LANG === 'he' ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
 body{margin:0;padding:14px;background:#e9ecf2;font-family:Arial,sans-serif}
 .g{display:flex;flex-wrap:wrap;gap:10px;align-items:stretch}
 .c{background:#fff;border-radius:8px;padding:8px 6px;text-align:center;font-size:11px;line-height:1.25;color:#222;min-width:${size + 24}px;max-width:${Math.round(size * 2.4)}px}
 .c.bad{outline:3px solid #e5484d}
 .n{font:bold 12px monospace;color:#555}
 .dk{background:#2b2f37;color:#ddd}
 .fig svg{width:100%;height:auto;display:block;direction:ltr}
 .fig svg text{unicode-bidi:plaintext}
</style>${scripts}</head><body><div class="g" id="g"></div>
<script>
 var D = Drive;
 D.settings.lang = '${LANG}';
 ${extraGlyphFiles}
 var SIGNS = ${JSON.stringify(kind === 'signs' ? signs : [])};
 var FIGS = ${JSON.stringify(typeof FIGS !== 'undefined' ? FIGS : {})};
 var DASH = ${JSON.stringify(kind === 'dash' ? dashList : [])};
 var PACKGLYPHS = ${JSON.stringify(signsFile.glyphs || {})};
 Object.keys(PACKGLYPHS).forEach(function (k) { D.glyphs.add(k, PACKGLYPHS[k]); });
 var g = document.getElementById('g'), html = '';
 if ('${kind}' === 'signs') SIGNS.forEach(function (s) {
   var bad = !(s.draw && s.draw.length) && !s.svg && !s.lamps;
   var miss = (s.draw || []).filter(function (it) { return it.g && !D.glyphs.has(it.g); }).map(function (it) { return it.g; });
   html += '<div class="c' + (bad || miss.length ? ' bad' : '') + '">' + D.signs.svg(s, { size: ${size} }) + '<div class="n">' + s.num + '</div><div>' + ((s.name && s.name['${LANG}']) || '') + (miss.length ? '<br><b style="color:#e5484d">? ' + miss.join(',') + '</b>' : '') + '</div></div>';
 });
 if ('${kind}' === 'dash') DASH.forEach(function (d) {
   html += '<div class="c dk">' + D.dash.svg(d, { size: ${size} }) + '<div class="n">' + d.id + '</div><div>' + ((d.name && d.name['${LANG}']) || '') + '</div></div>';
 });
 if ('${kind}' === 'glyphs') Object.keys(D.glyphs.lib).forEach(function (k) {
   var dk = k.indexOf('dash-') === 0;
   html += '<div class="c' + (dk ? ' dk' : '') + '"><svg viewBox="0 0 100 100" width="${size}" height="${size}" style="background:' + (dk ? '#15171c' : '#fff') + ';outline:1px dashed #bbb">' + D.glyphs.markup(k, function (n) { return n === 'field' ? (dk ? '#15171c' : '#fff') : n === 'symbol' ? (dk ? '#FFB000' : '#161616') : (D.signs.PALETTE[n] || n); }) + '</svg><div class="n">' + k + '</div></div>';
 });
 if ('${kind}' === 'figures') Object.keys(FIGS).forEach(function (id) {
   var f = FIGS[id], lab = f.labels || {};
   var svg = String(f.svg || '').replace(/[{][{]label:([^}]+)[}][}]/g, function (m, k) { return (lab[k] && lab[k]['${LANG}']) || k; });
   html += '<div class="c fig" style="width:${size * 4}px;max-width:none">' + svg + '<div class="n">' + id + '</div><div>' + ((f.caption && f.caption['${LANG}']) || '') + '</div></div>';
 });
 g.innerHTML = html;
</script></body></html>`;
const htmlFile = out.replace(/\.png$/, '.html');
fs.writeFileSync(htmlFile, html);
if (opt('html')) { console.log(htmlFile); process.exit(0); }

const n = kind === 'signs' ? signs.length : kind === 'dash' ? dashList.length : kind === 'figures' ? Object.keys(FIGS).length * 5 : 200;
const rows = Math.ceil(n / cols);
let W = Math.round(cols * (size * 1.25 + 46) + 30), H = Math.min(16000, Math.ceil(rows * 1.35) * (size + 80) + 60);
if (kind === 'figures') { const nf = Object.keys(FIGS).length; W = cols * (size * 4 + 40) + 40; H = Math.min(16000, Math.ceil(nf / cols) * (size * 3.4 + 90) + 60); }
const browsers = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium'
];
const exe = browsers.find((b) => fs.existsSync(b));
if (!exe) { console.error('no Chrome/Edge found; open ' + htmlFile); process.exit(1); }
const profile = path.join(path.dirname(out), '.chrome-profile');
execFileSync(exe, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--user-data-dir=' + profile,
  '--screenshot=' + out, '--window-size=' + W + ',' + H, '--virtual-time-budget=2000', 'file:///' + htmlFile.replace(/\\/g, '/')], { stdio: 'ignore', timeout: 60000 });
console.log(out + '  (' + n + ' items, ' + W + '×' + H + ')');
