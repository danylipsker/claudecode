/*  Draws the app icon as PNG files, for the home screen of a phone.
 *
 *    node tools/make-icons.js
 *
 *  icon.svg is the drawing; phones want it as PNG (iOS takes nothing else for
 *  a home-screen icon). This paints the same picture with no dependency: each
 *  pixel is sampled 4x4 against the shapes, then written as a PNG by hand.
 *  Keep the numbers here in step with icon.svg, which is drawn on 512x512.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const NIGHT = hex('#0f1220'), GOLD = hex('#ffd166'), LINE = hex('#7a4519');
const LIGHT = hex('#e2a562'), DARK = hex('#a2612b');

const over = (under, top, a) => under.map((u, i) => u + (top[i] - u) * a);

// Is (x, y) inside the rounded square at (x0, y0), side s, corner radius r?
function inSquare(x, y, x0, y0, s, r) {
  const dx = Math.max(x0 + r - x, x - (x0 + s - r), 0);
  const dy = Math.max(y0 + r - y, y - (y0 + s - r), 0);
  return x >= x0 && x <= x0 + s && y >= y0 && y <= y0 + s && dx * dx + dy * dy <= r * r;
}

// The colour of the drawing at a point of its 512x512 space.
function paint(x, y) {
  let c = NIGHT;
  if (Math.hypot(x - 256, y - 256) <= 196) c = over(c, GOLD, 0.13);
  if (inSquare(x, y, 126, 126, 260, 30)) c = LINE;
  if (inSquare(x, y, 146, 146, 220, 14)) {
    const t = Math.min(1, Math.max(0, ((x - 146) + (y - 146)) / 440));
    c = over(LIGHT, DARK, t);
  }
  if (inSquare(x, y, 138, 138, 236, 18)) {
    // the two braces: within 15 of either diagonal of the crate, square-capped
    const onBrace = (d, along) => Math.abs(d) <= 15 * Math.SQRT2 && along >= 146 * 2 - 15 * Math.SQRT2 && along <= 366 * 2 + 15 * Math.SQRT2;
    const hits = (onBrace(x - y, x + y) ? 1 : 0) + (onBrace(x + y - 512, 512 + x - y) ? 1 : 0);
    // strokes of one group at 60%: where they cross they still count once
    if (hits) c = over(c, LINE, 0.6);
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

const CRC = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});

function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  let crc = -1;
  for (const b of body) crc = CRC[(crc ^ b) & 255] ^ (crc >>> 8);
  const out = Buffer.alloc(body.length + 8);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE((crc ^ -1) >>> 0, body.length + 4);
  return out;
}

function png(size) {
  const px = render(size);
  const raw = Buffer.alloc(size * (size * 3 + 1));   // each row starts with its filter byte, 0
  for (let y = 0; y < size; y++) px.copy(raw, y * (size * 3 + 1) + 1, y * size * 3, (y + 1) * size * 3);
  const head = Buffer.alloc(13);
  head.writeUInt32BE(size, 0);
  head.writeUInt32BE(size, 4);
  head[8] = 8;    // bits a channel
  head[9] = 2;    // truecolour
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', head),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

for (const size of [180, 192, 512]) {
  const file = path.join(__dirname, '..', `icon-${size}.png`);
  fs.writeFileSync(file, png(size));
  console.log(`icon-${size}.png  ${fs.statSync(file).size} bytes`);
}
