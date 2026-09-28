/* Hyper Driving · dash.js — dashboard warning and indicator lights.
 *
 * A light in dash.json:
 *   { "id": "oil-pressure", "color": "red", "g": "dash-oil", "severity": "stop",
 *     "vehicles": ["car", "truck", "bus", "motorcycle"],
 *     "name": {he, en}, "meaning": {he, en}, "action": {he, en} }
 * "draw" (the item list of signs.js) may replace "g" for a light drawn from parts.
 * Colours follow ISO 2575 practice: red = danger, amber = fault/caution,
 * green = working, blue = main beam, white = information.
 */
(function (D) {
  'use strict';
  const { esc } = D.util;
  const DS = D.dash = {};
  const COL = { red: '#FF4136', amber: '#FFB000', yellow: '#FFD000', green: '#27D36F', blue: '#3C8BFF', white: '#EDEFF3' };
  DS.COL = COL;

  DS.svg = (d, opts) => {
    opts = opts || {};
    const size = opts.size || 64;
    const c = COL[d.color] || d.color || COL.amber;
    const label = esc(D.tr(d.name) || d.id);
    let body = '';
    if (d.g) body = `<g transform="translate(50 50) scale(0.74) translate(-50 -50)">${D.glyphs.markup(d.g, (n) => (n === 'field' ? '#15171c' : n === 'symbol' ? c : (D.signs.PALETTE[n] || c)))}</g>`;
    else if (d.draw) {
      const fake = { num: 'dash-' + d.id, cat: 'other', shape: 'none', colors: { symbol: c, field: '#15171c', border: '#15171c' }, draw: d.draw };
      body = D.signs.svg(fake, { size: 100 }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    }
    const bg = opts.plain ? '' : `<rect x="1" y="1" width="98" height="98" rx="18" fill="#15171c"/>`;
    return `<svg class="dash-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${label}">${bg}${body}</svg>`;
  };

  // ---------- glyphs for the lights (drawn in the light's colour) ----------
  const add = D.glyphs.add;
  add('dash-oil', [
    { d: 'M10 58 L18 50 L30 50 L34 44 L54 44 L60 50 L76 42 L92 36 L90 42 L64 64 L22 64 L18 58 Z' },
    { d: 'M40 44 L40 36 M34 36 L48 36', stroke: 5 },
    { d: 'M88 50 Q84 58 88 62 Q92 58 88 50 Z' }
  ]);
  add('dash-battery', [
    { d: 'M12 32 L88 32 L88 78 L12 78 Z M18 38 L18 72 L82 72 L82 38 Z', evenodd: true },
    { rect: [22, 24, 12, 8] }, { rect: [66, 24, 12, 8] },
    { d: 'M24 55 L38 55 M68 48 L68 62 M61 55 L75 55', stroke: 5, cap: 'butt' }
  ]);
  add('dash-coolant', [
    { d: 'M47 12 L53 12 L53 58 L47 58 Z' },
    { circle: [50, 64, 9] },
    { d: 'M53 22 L64 22 M53 32 L64 32 M53 42 L64 42', stroke: 4, cap: 'butt' },
    { d: 'M12 82 Q20 76 28 82 Q36 88 44 82 Q52 76 60 82 Q68 88 76 82 Q84 76 90 82', stroke: 4 }
  ]);
  add('dash-brake', [
    { circle: [50, 50, 26], stroke: 7 },
    { d: 'M20 22 Q6 50 20 78 M80 22 Q94 50 80 78', stroke: 6 },
    { d: 'M46 34 L54 34 L53 56 L47 56 Z' }, { circle: [50, 64, 4.5] }
  ]);
  add('dash-check-engine', [
    { d: 'M20 40 L28 40 L28 32 L40 32 L40 28 L58 28 L58 32 L66 32 L72 40 L78 40 L78 34 L86 34 L86 70 L78 70 L78 62 L72 62 L64 72 L28 72 L28 64 L20 64 L20 72 L12 72 L12 44 L20 44 Z M34 38 L34 66 L62 66 L68 58 L78 58 L78 46 L66 46 L62 38 Z', evenodd: true }
  ]);
  add('dash-abs', [
    { circle: [50, 50, 28], stroke: 6 },
    { d: 'M18 20 Q4 50 18 80 M82 20 Q96 50 82 80', stroke: 5 },
    { text: 'ABS', x: 50, y: 51, size: 20, weight: 800 }
  ]);
  add('dash-airbag', [
    { circle: [40, 20, 8] },
    { d: 'M30 32 L42 32 L52 58 L70 58 L76 80 L68 82 L63 66 L44 66 L30 40 Z' },
    { d: 'M20 34 L28 76 L60 76', stroke: 5 },
    { circle: [68, 38, 14] }
  ]);
  add('dash-seatbelt', [
    { circle: [50, 16, 9] },
    { d: 'M36 30 L64 30 L70 70 L62 70 L58 48 L42 48 L38 70 L30 70 Z' },
    { d: 'M36 30 L66 66', stroke: 5 },
    { d: 'M30 78 L70 78 L66 90 L34 90 Z' }
  ]);
  add('dash-low-fuel', [
    { d: 'M22 86 L22 22 Q22 14 30 14 L54 14 Q62 14 62 22 L62 86 Z M30 22 L30 42 L54 42 L54 22 Z', evenodd: true },
    { d: 'M62 34 L74 44 L74 72 Q74 80 81 78 Q86 76 86 70 L86 36 L78 28', stroke: 5 },
    { rect: [16, 84, 52, 6] }
  ]);
  add('dash-tpms', [
    { d: 'M22 30 Q14 50 22 76 L78 76 Q86 50 78 30', stroke: 7 },
    { d: 'M16 84 L84 84', stroke: 6, cap: 'butt' },
    { d: 'M46 34 L54 34 L53 56 L47 56 Z' }, { circle: [50, 65, 4.5] }
  ]);
  add('dash-esc', [
    { d: 'M26 40 L32 26 Q34 22 40 22 L60 22 Q66 22 68 26 L74 40 L78 40 L78 58 L22 58 L22 40 Z' },
    { d: 'M34 38 L38 28 L62 28 L66 38 Z', fill: 'field' },
    { rect: [26, 58, 10, 8] }, { rect: [64, 58, 10, 8] },
    { d: 'M24 90 Q34 76 22 70 M76 90 Q66 76 78 70', stroke: 5 }
  ]);
  add('dash-high-beam', [
    { d: 'M52 26 Q86 26 86 50 Q86 74 52 74 Z' },
    { d: 'M12 30 L42 30 M12 43 L42 43 M12 57 L42 57 M12 70 L42 70', stroke: 6, cap: 'butt' }
  ]);
  add('dash-low-beam', [
    { d: 'M52 26 Q86 26 86 50 Q86 74 52 74 Z' },
    { d: 'M40 30 L14 40 M40 43 L14 53 M40 57 L14 67 M40 70 L14 80', stroke: 6, cap: 'butt' }
  ]);
  add('dash-glow-plug', [
    { d: 'M20 30 Q20 22 28 22 L40 22 M60 22 L72 22 Q80 22 80 30', stroke: 6 },
    { d: 'M26 44 Q34 36 42 44 Q50 52 58 44 Q66 36 74 44 M26 60 Q34 52 42 60 Q50 68 58 60 Q66 52 74 60', stroke: 6 }
  ]);
  add('dash-parking-brake', [
    { circle: [50, 50, 26], stroke: 7 },
    { d: 'M20 22 Q6 50 20 78 M80 22 Q94 50 80 78', stroke: 6 },
    { text: 'P', x: 50, y: 51, size: 30, weight: 800 }
  ]);
})(globalThis.Drive = globalThis.Drive || {});
