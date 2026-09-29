#!/usr/bin/env node
/* Hyper Driving · tools/import-sign-art.js — the signs' pictures: reads the
 * traced sign chart (DRIVING-SIGNS/*.svg and its index.csv) into
 * content/il/sign-art.json, which the app draws every sign from.
 *
 *   node tools/import-sign-art.js            write content/il/sign-art.json
 *   node tools/import-sign-art.js --check    compare only, write nothing
 *
 * A file is named after the chart's sign number: 302.svg, 127פ.svg, ס-20.svg
 * (the chart writes ס-20; signs.json writes ס20), 128_1.svg / 128_2.svg (one
 * number, several pictures, in the chart's order). Every file must belong to a
 * sign of signs.json, and the name in its <title> must be that sign's Hebrew
 * name; the import stops otherwise. Signs without a picture keep their drawing.
 *
 * Paths are rewritten on a grid of 8 units per pixel of the chart's picture
 * (index.csv: source_px, width_pt), so rounding moves an outline by 1/16 pixel
 * at most. Then run tools/publish.js to list the file in the manifest.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { D, loadPack } = require('./load');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'DRIVING-SIGNS');
const OUT = path.join(ROOT, 'content/il/sign-art.json');
const UNITS_PER_PX = 8;
const check = process.argv.includes('--check');

function parseCSV(t) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const head = rows.shift();
  return rows.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((k, i) => [k, r[i]])));
}

loadPack('content/il');
const signs = D.data.signByNum;
const csv = parseCSV(fs.readFileSync(path.join(SRC, 'index.csv'), 'utf8').replace(/^﻿/, ''));
const byFile = new Map(csv.map((r) => [r.file, r]));
const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.svg'));

const problems = [];
const art = {};
let bytesIn = 0;
for (const file of files) {
  const m = file.match(/^(.+?)(?:_(\d+))?\.svg$/);
  const chartNum = m[1], variant = m[2] ? +m[2] : 1;
  const num = chartNum.replace(/^ס-/, 'ס');
  const s = signs.get(num);
  if (!s) { problems.push(file + ': no sign ' + num + ' in signs.json'); continue; }
  const text = fs.readFileSync(path.join(SRC, file), 'utf8');
  bytesIn += text.length;
  // the file's own title: "<chart number> - <Hebrew name>", and " (2/4)" on one of several pictures
  const title = ((text.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '').trim();
  const tm = title.match(/^(\S+)\s+-\s+([\s\S]+?)(?:\s+\((\d+)\/(\d+)\))?$/);
  if (!tm || tm[1] !== chartNum) problems.push(file + ': title "' + title + '" does not start with ' + chartNum);
  else if (tm[2].trim() !== String((s.name || {}).he || '').trim()) problems.push(file + ': title name "' + tm[2] + '" ≠ signs.json "' + (s.name || {}).he + '"');
  else if ((tm[3] ? +tm[3] : 1) !== variant) problems.push(file + ': title says picture ' + tm[3] + ', the file name ' + variant);
  const row = byFile.get(file);
  if (!row) { problems.push(file + ': not in index.csv'); continue; }
  const srcW = +String(row.source_px).split('x')[0], wpt = +row.width_pt;
  let pic;
  try { pic = D.signs.pictureFromSVG(text, { units: UNITS_PER_PX * srcW / wpt }); }
  catch (e) { problems.push(file + ': ' + e.message); continue; }
  const out = { w: pic.w, h: pic.h, pt: [+row.width_pt, +row.height_pt], page: +row.page, layers: pic.layers };
  (art[num] = art[num] || [])[variant - 1] = out;
}
Object.keys(art).forEach((n) => { if (art[n].some((p) => !p)) problems.push(n + ': a picture is missing between ' + n + '_1 and ' + n + '_' + art[n].length); });

const without = D.data.signs.filter((s) => !art[String(s.num)]).map((s) => s.num);
const count = Object.values(art).reduce((a, v) => a + v.length, 0);

// one sign number per line, in the order of signs.json
const order = D.data.signs.map((s) => String(s.num)).filter((n) => art[n]);
const body = '{\n "format": 1,\n "source": ' + JSON.stringify({
  he: 'לוח התמרורים של משרד התחבורה (מהדורת 2021), משורטט מחדש כקווים וקטוריים',
  en: 'The Ministry of Transport sign chart (2021 edition), traced to vector outlines'
}) + ',\n "art": {\n' + order.map((n) => '  ' + JSON.stringify(n) + ': ' + JSON.stringify(art[n])).join(',\n') + '\n }\n}\n';

console.log(`${files.length} files → ${count} pictures for ${order.length} signs; ${(bytesIn / 1e6).toFixed(2)} MB of SVG → ${(Buffer.byteLength(body) / 1e6).toFixed(2)} MB`);
console.log(`signs without a picture (they keep their drawing): ${without.join(', ') || 'none'}`);
if (problems.length) {
  console.log(problems.length + ' problem(s):\n  ' + problems.join('\n  '));
  process.exit(1);
}
if (!check) {
  fs.writeFileSync(OUT, body);
  console.log('wrote ' + path.relative(ROOT, OUT) + ' — now run: node tools/publish.js');
}
