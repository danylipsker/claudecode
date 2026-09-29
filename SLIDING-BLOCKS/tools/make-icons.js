/*  Draws the app icon: icon.svg, and the same picture as PNG files for the
 *  home screen of a phone (iOS takes nothing but PNG there).
 *
 *    node tools/make-icons.js
 *
 *  The picture is a list of shapes on a 512 x 512 square: a Klotski tray,
 *  the teal block about to leave through the gold gate. The SVG is written
 *  from that list, and the PNGs are painted from it with no dependency: each
 *  pixel sampled 4 x 4 against the shapes, then written as a PNG by hand.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// Tray of 4 x 4 cells, 78 px each, from (100, 100).
const C = 78, O = 100, GAP = 5;
const cell = (x, y, w, h) => ({ x: O + x * C + GAP, y: O + y * C + GAP, w: w * C - 2 * GAP, h: h * C - 2 * GAP });

const WOOD = { from: '#e2a562', to: '#a2612b', line: '#7a4519' };
const HERO = { from: '#8ff3ef', to: '#21a8a3', line: '#178f8a' };

const SHAPES = [
  { kind: 'rect', x: 0, y: 0, w: 512, h: 512, r: 0, fill: '#0f1220' },
  { kind: 'circle', cx: 256, cy: 256, r: 214, fill: '#ffd166', alpha: 0.1 },
  { kind: 'rect', x: 70, y: 70, w: 372, h: 372, r: 46, fill: '#3c4378' },
  { kind: 'rect', x: 96, y: 96, w: 320, h: 320, r: 24, fill: '#1e2342' },
  // the gate: an opening in the bottom of the rim, glowing
  { kind: 'rect', x: 178, y: 414, w: 156, h: 28, r: 6, fill: '#ffd166', alpha: 0.85 },
  ...[
    [0, 0, 1, 1], [3, 0, 1, 1], [1, 0, 2, 1],
    [0, 1, 1, 2], [3, 1, 1, 2],
    [0, 3, 1, 1], [3, 3, 1, 1]
  ].map(([x, y, w, h]) => ({ kind: 'block', ...cell(x, y, w, h), r: 12, paint: WOOD })),
  { kind: 'block', ...cell(1, 1, 2, 2), r: 18, paint: HERO },
  // eyes
  { kind: 'circle', cx: 228, cy: 250, r: 19, fill: '#f4f7ff' },
  { kind: 'circle', cx: 284, cy: 250, r: 19, fill: '#f4f7ff' },
  { kind: 'circle', cx: 228, cy: 259, r: 10, fill: '#1b2140' },
  { kind: 'circle', cx: 284, cy: 259, r: 10, fill: '#1b2140' }
];

/* ---------- SVG ---------- */

function svg() {
  const defs = [];
  const body = [];
  let g = 0;
  for (const s of SHAPES) {
    if (s.kind === 'rect') {
      body.push(`<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}" fill="${s.fill}"${s.alpha != null ? ` opacity="${s.alpha}"` : ''}/>`);
    } else if (s.kind === 'circle') {
      body.push(`<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="${s.fill}"${s.alpha != null ? ` opacity="${s.alpha}"` : ''}/>`);
    } else {
      const id = 'g' + g++;
      defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${s.paint.from}"/><stop offset="1" stop-color="${s.paint.to}"/></linearGradient>`);
      body.push(`<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.r}" fill="${s.paint.line}"/>`);
      body.push(`<rect x="${s.x + 5}" y="${s.y + 5}" width="${s.w - 10}" height="${s.h - 10}" rx="${s.r - 4}" fill="url(#${id})"/>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">\n  <defs>\n    ${defs.join('\n    ')}\n  </defs>\n  ${body.join('\n  ')}\n</svg>\n`;
}

/* ---------- PNG ---------- */

const over = (under, top, a) => under.map((u, i) => u + (top[i] - u) * a);

function inRound(x, y, x0, y0, w, h, r) {
  if (x < x0 || y < y0 || x > x0 + w || y > y0 + h) return false;
  const dx = Math.max(x0 + r - x, x - (x0 + w - r), 0);
  const dy = Math.max(y0 + r - y, y - (y0 + h - r), 0);
  return dx * dx + dy * dy <= r * r;
}

function paint(x, y) {
  let c = [0, 0, 0];
  for (const s of SHAPES) {
    if (s.kind === 'rect' && inRound(x, y, s.x, s.y, s.w, s.h, s.r)) c = over(c, hex(s.fill), s.alpha == null ? 1 : s.alpha);
    else if (s.kind === 'circle' && Math.hypot(x - s.cx, y - s.cy) <= s.r) c = over(c, hex(s.fill), s.alpha == null ? 1 : s.alpha);
    else if (s.kind === 'block') {
      if (inRound(x, y, s.x, s.y, s.w, s.h, s.r)) c = hex(s.paint.line);
      if (inRound(x, y, s.x + 5, s.y + 5, s.w - 10, s.h - 10, s.r - 4)) {
        const t = Math.min(1, Math.max(0, ((x - s.x) + (y - s.y)) / (s.w + s.h)));
        c = over(hex(s.paint.from), hex(s.paint.to), t);
      }
    }
  }
  return c;
}

function render(size) {
  const N = 4, px = Buffer.alloc(size * size * 3);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const sum = [0, 0, 0];
      for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
          const c = paint((x + (i + 0.5) / N) * 512 / size, (y + (j + 0.5) / N) * 512 / size);
          sum[0] += c[0]; sum[1] += c[1]; sum[2] += c[2];
        }
      }
      for (let k = 0; k < 3; k++) px[(y * size + x) * 3 + k] = Math.round(sum[k] / (N * N));
    }
  }
  return px;
}

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return (buf) => {
    let c = 0xffffffff;
    for (const b of buf) c = t[(c ^ b) & 255] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
})();

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(CRC(td));
  return Buffer.concat([len, td, crc]);
}

function png(size) {
  const px = render(size);
  const raw = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    px.copy(raw, y * (size * 3 + 1) + 1, y * size * 3, (y + 1) * size * 3);
  }
  const head = Buffer.alloc(13);
  head.writeUInt32BE(size, 0);
  head.writeUInt32BE(size, 4);
  head[8] = 8; head[9] = 2; head[10] = 0; head[11] = 0; head[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', head),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const dir = path.join(__dirname, '..');
fs.writeFileSync(path.join(dir, 'icon.svg'), svg());
for (const size of [180, 192, 512]) {
  fs.writeFileSync(path.join(dir, `icon-${size}.png`), png(size));
  console.log(`icon-${size}.png`);
}
console.log('icon.svg');
