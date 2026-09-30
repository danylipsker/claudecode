/* The Puzzle Cabinet · tools/make-icons.js
 *
 *   node tools/make-icons.js     writes icon.svg, icon-180.png, icon-192.png, icon-512.png
 *
 * The icon: the seven tangram pieces in their box, a little apart, on the
 * night-blue of the app with a gold glow. The PNGs are painted from the same
 * polygons with no dependency (4 × 4 samples a pixel, PNG written by hand).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// the tangram square (units 0..4) and its colours, as in engines/tangram.js
const PIECES = [
  [[[0, 0], [4, 0], [2, 2]], '#ff6b6b'],
  [[[0, 0], [2, 2], [0, 4]], '#ff8e6b'],
  [[[4, 4], [4, 2], [2, 4]], '#ffb057'],
  [[[3, 1], [4, 0], [4, 2]], '#38d9d3'],
  [[[2, 2], [3, 3], [1, 3]], '#4ecb8d'],
  [[[2, 2], [3, 1], [4, 2], [3, 3]], '#ffd166'],
  [[[0, 4], [1, 3], [3, 3], [2, 4]], '#b388ff']
];
const S = 66, O = 256 - 2 * S; // 4 units = 264 px, centred
const shrink = (poly, px) => {
  const c = poly.reduce((a, p) => [a[0] + p[0] / poly.length, a[1] + p[1] / poly.length], [0, 0]);
  return poly.map((p) => {
    const dx = p[0] - c[0], dy = p[1] - c[1], l = Math.hypot(dx, dy);
    return [p[0] - dx / l * px, p[1] - dy / l * px];
  });
};
// turn the whole square by 45° about the centre so it stands on a corner? no: keep it square, tilted slightly
const ang = -8 * Math.PI / 180;
const rot = (p) => {
  const x = p[0] - 256, y = p[1] - 256;
  return [256 + x * Math.cos(ang) - y * Math.sin(ang), 256 + x * Math.sin(ang) + y * Math.cos(ang)];
};
const polys = PIECES.map(([poly, col]) => ({ pts: shrink(poly.map((p) => [O + p[0] * S, O + p[1] * S]), 7).map(rot), col }));

function inPoly(x, y, pts) {
  let ins = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i], b = pts[j];
    if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) ins = !ins;
  }
  return ins;
}

function colourAt(x, y) {
  // background with a soft gold glow
  let c = hex('#0f1220');
  const d = Math.hypot(x - 256, y - 256);
  const glow = Math.max(0, 1 - d / 236) * 0.16;
  const g = hex('#ffd166');
  c = c.map((v, i) => v + (g[i] - v) * glow);
  // the box
  const bx = Math.abs(x - 256), by = Math.abs(y - 256);
  if (bx < 168 && by < 168) {
    const r = 34, qx = Math.max(bx - (168 - r), 0), qy = Math.max(by - (168 - r), 0);
    if (Math.hypot(qx, qy) < r) c = hex('#1b2040');
  }
  for (const p of polys) {
    if (inPoly(x, y, p.pts)) {
      const base = hex(p.col);
      // a little light from the top left
      const k = 1.06 - (x + y) / 512 * 0.14;
      c = base.map((v) => Math.min(255, v * k));
    }
  }
  return c;
}

function png(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const sc = 512 / size;
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < 4; sy++) for (let sx = 0; sx < 4; sx++) {
        const c = colourAt((x + (sx + 0.5) / 4) * sc, (y + (sy + 0.5) / 4) * sc);
        r += c[0]; g += c[1]; b += c[2];
      }
      const o = y * (size * 4 + 1) + 1 + x * 4;
      raw[o] = Math.round(r / 16); raw[o + 1] = Math.round(g / 16); raw[o + 2] = Math.round(b / 16); raw[o + 3] = 255;
    }
  }
  const crcTable = [];
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcTable[n] = c >>> 0; }
  const crc = (buf) => { let c = 0xffffffff; for (const v of buf) c = crcTable[(c ^ v) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const cr = Buffer.alloc(4); cr.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, cr]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

const r1 = (v) => Math.round(v * 10) / 10;
const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\n' +
  '  <defs><radialGradient id="glow"><stop offset="0" stop-color="#ffd166" stop-opacity=".16"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient></defs>\n' +
  '  <rect width="512" height="512" fill="#0f1220"/>\n  <circle cx="256" cy="256" r="236" fill="url(#glow)"/>\n' +
  '  <rect x="88" y="88" width="336" height="336" rx="34" fill="#1b2040"/>\n' +
  polys.map((p) => '  <path d="M' + p.pts.map((q) => r1(q[0]) + ' ' + r1(q[1])).join('L') + 'Z" fill="' + p.col + '"/>').join('\n') + '\n</svg>\n';
fs.writeFileSync(path.join(ROOT, 'icon.svg'), svg);
[180, 192, 512].forEach((n) => fs.writeFileSync(path.join(ROOT, 'icon-' + n + '.png'), png(n)));
console.log('icons written');
