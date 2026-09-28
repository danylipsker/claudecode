/* Hyper Driving · glyphs.js — the pictograms signs and warning lights are drawn
 * with. Each glyph lives in a 100 × 100 box centred on (50, 50) and is filled
 * with the colour it is given ("currentColor"); parts may ask for the sign's
 * field colour ("field") to cut windows and gaps.
 *
 *   D.glyphs.add('car-side', [{ d: 'M…' }, { d: 'M…', fill: 'field' }])
 *   D.glyphs.add('arrow-up', { d: 'M…', stroke: 12 })   // a stroked path
 *
 * A content pack can add or replace glyphs (signs.json → "glyphs": { name: parts })
 * so an authority can supply official artwork without an app release.
 */
(function (D) {
  'use strict';
  const G = D.glyphs = { lib: {} };

  G.add = (name, parts) => { G.lib[name] = Array.isArray(parts) ? parts : [parts]; };
  G.has = (name) => !!G.lib[name];

  // parts → SVG markup; colours: 'symbol' (default) | 'field' | 'border' | a palette name | #hex
  G.markup = (name, colorOf) => {
    const parts = G.lib[name];
    if (!parts) return '';
    return parts.map((p) => {
      const col = colorOf(p.fill || 'symbol');
      if (p.circle) {
        const [cx, cy, r] = p.circle;
        return p.stroke
          ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="${p.stroke}"/>`
          : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"/>`;
      }
      if (p.rect) {
        const [x, y, w, hh, rx] = p.rect;
        return `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${rx || 0}" fill="${p.stroke ? 'none' : col}"${p.stroke ? ` stroke="${col}" stroke-width="${p.stroke}"` : ''}/>`;
      }
      if (p.text) {
        return `<text x="${p.x || 50}" y="${p.y || 50}" font-size="${p.size || 30}" font-weight="${p.weight || 700}" text-anchor="middle" dominant-baseline="central" fill="${col}" font-family="Arial, 'Segoe UI', sans-serif"${/[֐-׿]/.test(p.text) ? ' direction="rtl" unicode-bidi="embed"' : ' direction="ltr"'}>${D.util.esc(p.text)}</text>`;
      }
      if (p.stroke) {
        return `<path d="${p.d}" fill="none" stroke="${col}" stroke-width="${p.stroke}" stroke-linecap="${p.cap || 'round'}" stroke-linejoin="${p.join || 'round'}"/>`;
      }
      return `<path d="${p.d}" fill="${col}"${p.evenodd ? ' fill-rule="evenodd"' : ''}/>`;
    }).join('');
  };

  // ---------- arrows ----------
  // a straight arrow pointing up, shaft width 12, head 34 wide
  G.add('arrow-up', { d: 'M50 12 L74 40 L57 40 L57 88 L43 88 L43 40 L26 40 Z' });
  G.add('arrow-turn-right', { d: 'M40 88 L40 52 Q40 36 56 36 L66 36 L66 22 L90 44 L66 66 L66 52 L58 52 Q54 52 54 56 L54 88 Z' });
  G.add('arrow-turn-left', { d: 'M60 88 L60 52 Q60 36 44 36 L34 36 L34 22 L10 44 L34 66 L34 52 L42 52 Q46 52 46 56 L46 88 Z' });
  G.add('arrow-uturn-left', { d: 'M68 88 L68 40 Q68 16 46 16 Q24 16 24 40 L24 56 L12 56 L31 80 L50 56 L38 56 L38 40 Q38 30 46 30 Q54 30 54 40 L54 88 Z' });
  G.add('arrow-round', { d: 'M50 20 A30 30 0 1 1 22 60', stroke: 9 });

  // ---------- road users (side views face right; mirror with flip) ----------
  G.add('car-side', [
    { d: 'M10 64 L12 52 Q14 46 22 45 L32 44 L42 33 Q45 30 50 30 L70 30 Q75 30 78 34 L86 44 Q92 45 92 52 L92 64 Z' },
    { d: 'M44 42 L51 34 L60 34 L60 42 Z M64 34 L70 34 Q73 34 75 37 L79 42 L64 42 Z', fill: 'field' },
    { circle: [28, 66, 10] }, { circle: [74, 66, 10] },
    { circle: [28, 66, 4], fill: 'field' }, { circle: [74, 66, 4], fill: 'field' }
  ]);
  G.add('car-rear', [
    { d: 'M20 70 L20 50 L27 32 Q29 28 34 28 L66 28 Q71 28 73 32 L80 50 L80 70 Z' },
    { d: 'M30 46 L35 34 L65 34 L70 46 Z', fill: 'field' },
    { rect: [18, 70, 14, 12, 2] }, { rect: [68, 70, 14, 12, 2] },
    { rect: [24, 54, 10, 5, 1], fill: 'field' }, { rect: [66, 54, 10, 5, 1], fill: 'field' }
  ]);
  G.add('truck-side', [
    { d: 'M6 66 L6 26 L62 26 L62 66 Z' },
    { d: 'M64 66 L64 38 L80 38 Q84 38 86 42 L94 54 L94 66 Z' },
    { d: 'M69 42 L80 42 L87 53 L69 53 Z', fill: 'field' },
    { circle: [22, 70, 9] }, { circle: [48, 70, 9] }, { circle: [80, 70, 9] },
    { circle: [22, 70, 3.5], fill: 'field' }, { circle: [48, 70, 3.5], fill: 'field' }, { circle: [80, 70, 3.5], fill: 'field' }
  ]);
  G.add('bus-side', [
    { d: 'M6 70 L6 32 Q6 26 12 26 L86 26 Q92 26 94 32 L96 44 L96 70 Z' },
    { d: 'M12 32 L26 32 L26 46 L12 46 Z M30 32 L44 32 L44 46 L30 46 Z M48 32 L62 32 L62 46 L48 46 Z M66 32 L80 32 L80 46 L66 46 Z M84 32 L90 32 L92 46 L84 46 Z', fill: 'field' },
    { circle: [24, 72, 9] }, { circle: [76, 72, 9] },
    { circle: [24, 72, 3.5], fill: 'field' }, { circle: [76, 72, 3.5], fill: 'field' }
  ]);
  G.add('motorcycle-side', [
    { circle: [22, 66, 14], stroke: 6 }, { circle: [78, 66, 14], stroke: 6 },
    { d: 'M22 66 L42 46 L64 46 L78 66', stroke: 6 },
    { d: 'M36 44 Q46 34 58 38 L66 44 L40 50 Z' },
    { d: 'M62 40 L70 28 L78 28', stroke: 5 },
    { d: 'M44 38 Q48 22 58 26 Q62 30 56 36', stroke: 0 }
  ]);
  G.add('bicycle', [
    { circle: [24, 64, 16], stroke: 5 }, { circle: [76, 64, 16], stroke: 5 },
    { d: 'M24 64 L42 40 L66 40 L76 64 M42 40 L50 64 L66 40 M50 64 L24 64 M38 32 L48 32 M66 40 L62 28 L70 28', stroke: 5 }
  ]);
  G.add('pedestrian', [
    { circle: [52, 16, 8] },
    { d: 'M46 28 Q52 26 58 30 L66 50 L60 52 L55 40 L54 58 L66 88 L58 90 L48 66 L40 90 L32 88 L42 58 L42 42 L36 54 L30 52 Z' }
  ]);
  G.add('children', [
    { circle: [34, 22, 8] },
    { d: 'M28 34 Q34 31 40 35 L46 54 L40 56 L37 46 L37 62 L46 88 L38 90 L32 70 L26 90 L18 88 L28 62 L28 46 L23 56 L17 54 Z' },
    { circle: [68, 36, 6.5] },
    { d: 'M63 46 Q68 44 73 47 L78 62 L73 63 L71 56 L71 68 L78 88 L72 90 L67 74 L62 90 L56 88 L63 68 L63 57 L59 64 L54 62 Z' }
  ]);
  G.add('cow', [
    { d: 'M14 40 Q14 34 20 34 L66 34 Q72 34 76 30 L84 26 L88 30 L86 36 L90 42 L84 48 L78 46 L74 50 L74 76 L66 76 L66 58 L28 58 L28 76 L20 76 L20 54 Q14 52 14 46 Z' },
    { d: 'M14 42 L8 60', stroke: 3 }
  ]);
  G.add('deer', [
    { d: 'M18 48 Q18 42 26 42 L62 42 L70 30 L66 18 L70 16 L74 26 L78 18 L82 20 L76 32 L80 36 L84 40 L78 44 L74 42 L70 50 L70 80 L64 80 L62 60 L32 60 L28 80 L22 80 L22 58 Q18 56 18 50 Z' }
  ]);
  G.add('camel', [
    { d: 'M10 56 Q12 46 20 46 Q26 30 36 44 Q44 28 54 44 L66 44 L72 30 L80 26 L86 30 L82 34 L76 36 L74 52 L72 56 L70 84 L64 84 L62 62 L34 62 L30 84 L24 84 L22 60 Q12 62 10 56 Z' }
  ]);
  G.add('tractor-side', [
    { d: 'M20 60 L20 36 L44 36 L48 22 L64 22 L64 44 L86 44 L86 60 Z' },
    { d: 'M50 26 L60 26 L60 40 L50 40 Z', fill: 'field' },
    { circle: [34, 66, 16] }, { circle: [34, 66, 7], fill: 'field' },
    { circle: [78, 70, 10] }, { circle: [78, 70, 4], fill: 'field' }
  ]);
  G.add('train', [
    { d: 'M14 70 L14 36 Q14 28 22 28 L66 28 L66 22 L74 22 L74 28 L80 28 Q88 28 88 36 L88 70 Z' },
    { d: 'M22 36 L38 36 L38 50 L22 50 Z M44 36 L60 36 L60 50 L44 50 Z M66 36 L80 36 L80 50 L66 50 Z', fill: 'field' },
    { circle: [28, 74, 7] }, { circle: [50, 74, 7] }, { circle: [74, 74, 7] },
    { d: 'M6 84 L94 84', stroke: 4 }
  ]);
  G.add('plane', { d: 'M50 8 Q56 8 56 20 L56 40 L92 58 L92 66 L56 56 L56 76 L66 84 L66 90 L50 86 L34 90 L34 84 L44 76 L44 56 L8 66 L8 58 L44 40 L44 20 Q44 8 50 8 Z' });

  // ---------- road situations ----------
  G.add('curve-right', { d: 'M40 90 L40 60 Q40 40 56 32 L66 26', stroke: 10, cap: 'butt' });
  G.add('curve-right-head', { d: 'M58 16 L80 20 L70 40 Z' });
  G.add('bend-right', [{ d: 'M40 90 L40 62 Q40 44 58 36 L64 33', stroke: 11, cap: 'butt' }, { d: 'M58 22 L82 26 L68 46 Z' }]);
  G.add('bend-left', [{ d: 'M60 90 L60 62 Q60 44 42 36 L36 33', stroke: 11, cap: 'butt' }, { d: 'M42 22 L18 26 L32 46 Z' }]);
  G.add('double-bend-right', [{ d: 'M38 92 L38 76 Q38 62 54 56 Q70 50 64 38 Q60 30 48 26', stroke: 10, cap: 'butt' }, { d: 'M54 14 L36 24 L54 36 Z' }]);
  G.add('double-bend-left', [{ d: 'M62 92 L62 76 Q62 62 46 56 Q30 50 36 38 Q40 30 52 26', stroke: 10, cap: 'butt' }, { d: 'M46 14 L64 24 L46 36 Z' }]);
  G.add('crossroads', { d: 'M50 12 L50 88 M12 50 L88 50', stroke: 12, cap: 'butt' });
  G.add('side-road-right', { d: 'M44 12 L44 88 M44 50 L86 50', stroke: 12, cap: 'butt' });
  G.add('side-road-left', { d: 'M56 12 L56 88 M56 50 L14 50', stroke: 12, cap: 'butt' });
  G.add('t-junction', { d: 'M12 34 L88 34 M50 34 L50 88', stroke: 12, cap: 'butt' });
  G.add('narrowing-both', { d: 'M30 90 L30 62 L40 42 L40 12 M70 90 L70 62 L60 42 L60 12', stroke: 8 });
  G.add('narrowing-right', { d: 'M34 90 L34 12 M72 90 L72 62 L58 42 L58 12', stroke: 8 });
  G.add('narrowing-left', { d: 'M66 90 L66 12 M28 90 L28 62 L42 42 L42 12', stroke: 8 });
  G.add('two-way', [{ d: 'M36 88 L36 30', stroke: 9 }, { d: 'M36 14 L50 34 L22 34 Z' }, { d: 'M64 14 L64 72', stroke: 9 }, { d: 'M64 88 L50 68 L78 68 Z' }]);
  G.add('bump', { d: 'M8 78 L30 78 Q50 46 70 78 L92 78 L92 86 L8 86 Z' });
  G.add('dip', { d: 'M8 60 L30 60 Q50 92 70 60 L92 60 L92 52 L70 52 Q50 84 30 52 L8 52 Z' });
  G.add('slippery', [
    { d: 'M30 50 L32 42 Q33 38 38 38 L44 38 L50 31 Q52 29 55 29 L66 29 Q69 29 71 32 L75 38 Q80 38 80 43 L80 50 Z' },
    { circle: [40, 52, 5] }, { circle: [70, 52, 5] },
    { d: 'M34 90 Q24 80 36 70 Q48 60 38 58 M66 90 Q76 80 64 70 Q52 62 62 58', stroke: 4 }
  ]);
  G.add('falling-rocks', [
    { d: 'M12 90 L12 20 L40 90 Z' },
    { d: 'M48 40 L58 36 L62 46 L52 50 Z M58 60 L70 56 L74 68 L62 72 Z M44 70 L52 68 L54 76 L46 78 Z' }
  ]);
  G.add('roadworks', [
    { circle: [58, 18, 7] },
    { d: 'M52 28 L62 28 L66 50 L58 52 L60 66 L70 86 L62 88 L52 70 L44 88 L36 86 L46 66 L46 46 L34 58 L28 54 Z' },
    { d: 'M20 44 L40 60', stroke: 4 }, { d: 'M14 62 L34 70 L30 76 Z' },
    { d: 'M72 88 L80 72 L92 88 Z' }
  ]);
  G.add('traffic-signals', [
    { rect: [36, 8, 28, 84, 8] },
    { circle: [50, 24, 9], fill: 'red' }, { circle: [50, 50, 9], fill: 'yellow' }, { circle: [50, 76, 9], fill: 'green' }
  ]);
  G.add('level-crossing-gate', [
    { d: 'M16 60 L84 60 L84 72 L16 72 Z' },
    { d: 'M26 60 L34 60 L28 72 L20 72 Z M46 60 L54 60 L48 72 L40 72 Z M66 60 L74 60 L68 72 L60 72 Z', fill: 'field' },
    { d: 'M20 72 L20 88 M80 72 L80 88', stroke: 5 }
  ]);
  G.add('wind', { d: 'M12 36 L62 36 Q76 36 76 26 Q76 16 66 18 M12 52 L80 52 Q92 52 92 64 Q92 76 80 72 M12 68 L52 68', stroke: 6 });
  G.add('tunnel', [{ d: 'M8 90 L8 50 Q8 12 50 12 Q92 12 92 50 L92 90 L72 90 L72 54 Q72 34 50 34 Q28 34 28 54 L28 90 Z' }]);
  G.add('exclamation', [{ d: 'M43 14 L57 14 L54 64 L46 64 Z' }, { circle: [50, 80, 7] }]);
  G.add('horn', { d: 'M14 42 L32 42 L66 20 L66 80 L32 58 L14 58 Z M74 34 Q84 50 74 66 M82 26 Q98 50 82 74', stroke: 0 });
  G.add('fuel-pump', [
    { d: 'M22 88 L22 20 Q22 12 30 12 L56 12 Q64 12 64 20 L64 88 Z' },
    { d: 'M30 20 L56 20 L56 40 L30 40 Z', fill: 'field' },
    { d: 'M64 30 L76 40 L76 74 Q76 82 84 80 Q88 78 88 72 L88 34 L80 26', stroke: 5 },
    { rect: [16, 86, 54, 6] }
  ]);
  G.add('bed', [{ d: 'M10 76 L10 30 L18 30 L18 56 L90 56 L90 76 L82 76 L82 68 L18 68 L18 76 Z' }, { circle: [30, 47, 8] }, { d: 'M42 40 L82 44 Q88 45 88 52 L42 52 Z' }]);
  G.add('hospital-h', { d: 'M28 14 L42 14 L42 42 L58 42 L58 14 L72 14 L72 86 L58 86 L58 56 L42 56 L42 86 L28 86 Z' });
  G.add('parking-p', { d: 'M30 88 L30 12 L56 12 Q80 12 80 36 Q80 60 56 60 L44 60 L44 88 Z M44 24 L44 48 L55 48 Q66 48 66 36 Q66 24 55 24 Z', evenodd: true });
  G.add('wheelchair', [
    { circle: [42, 14, 8] },
    { d: 'M36 26 L46 26 L48 50 L70 50 L80 76 L72 79 L64 60 L42 60 Z' },
    { d: 'M36 44 A24 24 0 1 0 70 70', stroke: 6 }
  ]);
})(globalThis.Drive = globalThis.Drive || {});
