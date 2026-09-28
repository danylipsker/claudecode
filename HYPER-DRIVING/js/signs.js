/* Hyper Driving · signs.js — shows a traffic sign, road marking or traffic
 * light. A sign has two sources, and the first that exists wins:
 *
 *   1. its official picture, taken from the Ministry's sign chart
 *      (signs-art.json: { "art": { "302": { w, h, src: "data:image/png;…",
 *      alt: [{ w, h, src }] } } } — "alt" holds the other forms the chart
 *      shows under the same number, e.g. the sign with and without its plate);
 *   2. its drawing in signs.json — a shape, colours and a list of drawing
 *      items, so an authority can add a sign through a content update before
 *      it has a picture, and so nothing here needs a picture file.
 *
 * A sign:
 *   { "num": "302", "series": "300", "cat": "priority", "shape": "octagon",
 *     "colors": { "field": "red", "border": "white", "symbol": "white" },
 *     "draw": [ items… ], "name": {he, en}, "meaning": {he, en}, "notes": {he, en},
 *     "related": ["301"], "w": 1.5 (width ÷ height, for rectangles), "svg": "<svg…>" (optional full override) }
 *
 * Shapes: triangle | triangle-down | circle | octagon | square | rect | diamond |
 *         plate | marking | light | none
 * Items (coordinates in the 100-high box; rectangles are 100·w wide):
 *   { "g": "arrow-up", "x": 50, "y": 60, "s": 0.5, "rot": 0, "flip": false, "c": "symbol" }   a glyph
 *   { "t": "50", "x": 50, "y": 52, "size": 40, "c": "symbol", "wt": 700 }                 text
 *   { "bar": 1 }                                            the red diagonal of a prohibition
 *   { "d": "M…", "c": "symbol", "sw": 0 }                   a path (sw > 0 → stroked)
 *   { "line": [x1, y1, x2, y2], "c": "white", "sw": 3, "dash": [8, 6] }
 *   { "rect": [x, y, w, h, rx], "c": "…" }   { "circle": [cx, cy, r], "c": "…", "sw": 0 }
 * Lights: "lamps": [{ "c": "red", "on": true, "g": "arrow-turn-left" }], "flash": [index…]
 * Colours: symbol | field | border | a palette name below | #hex.
 */
(function (D) {
  'use strict';
  const { esc } = D.util;
  const SG = D.signs = {};

  // the colours of the official sign chart (measured on the Ministry's pictures)
  const PALETTE = {
    red: '#FF0000', blue: '#0000FF', green: '#007C00', yellow: '#FFFF00', orange: '#FF7300',
    brown: '#A4740F', black: '#000000', white: '#FFFFFF', grey: '#8A8F98', asphalt: '#6A6A6A',
    darkgrey: '#2A2D33', lamp_off: '#3A3D44', lampred: '#FF3B30', lampyellow: '#FFC400', lampgreen: '#1FD37A'
  };
  SG.PALETTE = PALETTE;

  const DEFAULTS = {
    warning: { shape: 'triangle', field: 'white', border: 'red', symbol: 'black' },
    priority: { shape: 'triangle-down', field: 'white', border: 'red', symbol: 'black' },
    prohibition: { shape: 'circle', field: 'white', border: 'red', symbol: 'black' },
    mandatory: { shape: 'circle', field: 'blue', border: 'white', symbol: 'white' },
    information: { shape: 'square', field: 'blue', border: 'white', symbol: 'white' },
    guide: { shape: 'rect', field: 'green', border: 'white', symbol: 'white' },
    supplementary: { shape: 'plate', field: 'white', border: 'black', symbol: 'black' },
    roadworks: { shape: 'triangle', field: 'yellow', border: 'red', symbol: 'black' },
    marking: { shape: 'marking', field: 'asphalt', border: 'asphalt', symbol: 'white' },
    light: { shape: 'light', field: 'darkgrey', border: 'black', symbol: 'white' },
    other: { shape: 'square', field: 'white', border: 'black', symbol: 'black' }
  };
  SG.DEFAULTS = DEFAULTS;

  // a colour name → a colour; anything unknown (prose from a description,
  // a typo) falls back to the given default instead of rendering black
  const col = (name, roles, dflt) => {
    if (!name) return dflt || roles.symbol;
    if (name === 'symbol' || name === 'field' || name === 'border') return roles[name];
    if (/^(#[0-9a-f]{3,8}|rgba?\(|hsla?\()/i.test(name)) return name;
    return PALETTE[name] || dflt || roles.symbol;
  };

  // equilateral triangle geometry: outer points, and an inset copy
  const TRI_UP = [[50, 7], [97, 88.4], [3, 88.4]];
  const TRI_DOWN = [[3, 8], [97, 8], [50, 89.4]];
  const inset = (pts, k) => {
    const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
    return pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
  };
  const poly = (pts) => 'M' + pts.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join(' L') + ' Z';
  const octagon = (r, cx, cy) => {
    const pts = [];
    for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return pts;
  };

  function shapeSVG(shape, roles, W) {
    const f = roles.field, b = roles.border;
    switch (shape) {
      case 'triangle': {
        const inner = inset(TRI_UP, 0.66);   // border ≈ 11.5 % of the height, as on the official chart
        return `<path d="${poly(TRI_UP)}" fill="${b}" stroke="${b}" stroke-width="6" stroke-linejoin="round"/>` +
          `<path d="${poly(inner)}" fill="${f}" stroke="${f}" stroke-width="2" stroke-linejoin="round"/>`;
      }
      case 'triangle-down': {
        const inner = inset(TRI_DOWN, 0.66);
        return `<path d="${poly(TRI_DOWN)}" fill="${b}" stroke="${b}" stroke-width="6" stroke-linejoin="round"/>` +
          `<path d="${poly(inner)}" fill="${f}" stroke="${f}" stroke-width="2" stroke-linejoin="round"/>`;
      }
      case 'circle':
        // mandatory: the field colour to the edge, with a thin ring of the border colour just inside it
        if (roles._thinBorder) return `<circle cx="50" cy="50" r="48" fill="${f}"/><circle cx="50" cy="50" r="46" fill="none" stroke="${b}" stroke-width="1.8"/>`;
        // prohibition: the ring is about a quarter of the radius
        return `<circle cx="50" cy="50" r="48" fill="${b}"/><circle cx="50" cy="50" r="36.5" fill="${f}"/>`;
      case 'octagon':
        // stop: red rim, white ring, red field
        return `<path d="${poly(octagon(49, 50, 50))}" fill="${f}"/><path d="${poly(octagon(45.5, 50, 50))}" fill="${b}"/><path d="${poly(octagon(39.5, 50, 50))}" fill="${f}"/>`;
      case 'diamond':
        return `<path d="M50 2 L98 50 L50 98 L2 50 Z" fill="${b}" stroke="${b}" stroke-width="2" stroke-linejoin="round"/><path d="M50 9 L91 50 L50 91 L9 50 Z" fill="${f}"/>`;
      case 'square':
        // a panel: the field colour to the edge, a thin frame of the border colour set in from it
        return `<rect x="1.5" y="1.5" width="97" height="97" rx="8" fill="${f}"/><rect x="5" y="5" width="90" height="90" rx="5" fill="none" stroke="${b}" stroke-width="2.4"/>`;
      case 'rect':
        return `<rect x="1.5" y="1.5" width="${W - 3}" height="97" rx="7" fill="${f}"/><rect x="4.5" y="4.5" width="${W - 9}" height="91" rx="5" fill="none" stroke="${b}" stroke-width="1.4"/>`;
      case 'plate':
        return `<rect x="1.5" y="1.5" width="${W - 3}" height="97" rx="6" fill="${b}"/><rect x="5" y="5" width="${W - 10}" height="90" rx="3.5" fill="${f}"/>`;
      case 'marking':
        return `<rect x="0" y="0" width="${W}" height="100" rx="6" fill="${f}"/>`;
      case 'none':
        return '';
      default:
        return `<rect x="1.5" y="1.5" width="97" height="97" rx="8" fill="${f}"/><rect x="5" y="5" width="90" height="90" rx="5" fill="none" stroke="${b}" stroke-width="2.4"/>`;
    }
  }

  function itemSVG(it, roles, clipId) {
    const c = col(it.c, roles);
    if (it.g) {
      const x = it.x != null ? it.x : 50, y = it.y != null ? it.y : 50, s = it.s != null ? it.s : 0.6;
      const tf = `translate(${x} ${y})` + (it.rot ? ` rotate(${it.rot})` : '') + ` scale(${it.flip ? -s : s} ${it.flipY ? -s : s}) translate(-50 -50)`;
      return `<g transform="${tf}">${D.glyphs.markup(it.g, (n) => (n === 'symbol' ? c : col(n, roles)))}</g>`;
    }
    if (it.t != null) {
      return `<text x="${it.x != null ? it.x : 50}" y="${it.y != null ? it.y : 50}" font-size="${it.size || 34}" font-weight="${it.wt || 700}" text-anchor="middle" dominant-baseline="central" fill="${c}" font-family="Arial, 'Segoe UI', 'Noto Sans Hebrew', sans-serif"${it.ls ? ` letter-spacing="${it.ls}"` : ''}${/[֐-׿]/.test(it.t) ? ' direction="rtl" unicode-bidi="embed"' : ' direction="ltr"'}>${esc(it.t)}</text>`;
    }
    if (it.bar) {
      return `<line x1="17" y1="17" x2="83" y2="83" stroke="${col(it.c || 'red', roles)}" stroke-width="${it.sw || 9}"${clipId ? ` clip-path="url(#${clipId})"` : ''}/>`;
    }
    if (it.d) {
      return it.sw
        ? `<path d="${it.d}" fill="none" stroke="${c}" stroke-width="${it.sw}" stroke-linecap="${it.cap || 'round'}" stroke-linejoin="round"${it.dash ? ` stroke-dasharray="${it.dash.join(' ')}"` : ''}/>`
        : `<path d="${it.d}" fill="${c}"${it.evenodd ? ' fill-rule="evenodd"' : ''}/>`;
    }
    if (it.line) {
      const [x1, y1, x2, y2] = it.line;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${it.sw || 3}"${it.dash ? ` stroke-dasharray="${it.dash.join(' ')}"` : ''} stroke-linecap="${it.cap || 'butt'}"/>`;
    }
    if (it.rect) {
      const [x, y, w, h, rx] = it.rect;
      return it.sw
        ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx || 0}" fill="none" stroke="${c}" stroke-width="${it.sw}"/>`
        : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx || 0}" fill="${c}"/>`;
    }
    if (it.circle) {
      const [cx, cy, r] = it.circle;
      return it.sw
        ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="${it.sw}"/>`
        : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/>`;
    }
    return '';
  }

  // Traffic lights are drawn the way the official sign chart draws them: a white
  // box with a black outline, lamps outlined in black, a lit lamp filled with its
  // colour and an unlit one white. A white-light (tram/bus) signal, and a lamp
  // that shows a figure (pedestrian, cyclist), is a black disc with the shape in
  // the light's colour. A lamp may set "face": "black" | "white" | "color" itself.
  function lightSVG(s, roles) {
    const lamps = s.lamps || [];
    const n = Math.max(1, lamps.length);
    const W = s.w ? s.w * 100 : 100;
    const horiz = !!s.horizontal;
    let r = horiz ? Math.min(30, (W - 8) / (2 * n) - 2) : Math.min(14, 96 / (2 * n) - 2);
    let hw = horiz ? W - 6 : 2 * r + 8;
    let hh = horiz ? 2 * r + 8 : n * (2 * r + 4) + 4;
    // a single-lamp head (beacon, cyclist light) is a square box with a large lamp
    if (n === 1) { hw = hh = Math.min(W, 100) - 6; r = hw * 0.38; }
    const hx = (W - hw) / 2, hy = (100 - hh) / 2;
    let out = `<rect x="${hx}" y="${hy}" width="${hw}" height="${hh}" rx="2.5" fill="${PALETTE.white}" stroke="${PALETTE.black}" stroke-width="1.6"/>`;
    const LAMP = { red: '#FF0000', yellow: '#FFFF00', green: '#007C00', white: '#FFFFFF' };
    lamps.forEach((l, i) => {
      const cx = horiz ? hx + (hw / n) * (i + 0.5) : W / 2;
      const cy = horiz ? 50 : hy + (hh / n) * (i + 0.5);
      const lampCol = LAMP[l.c] || col(l.c, roles);
      const on = !!l.on;
      const flash = (s.flash || []).includes(i);
      const figure = !!l.g && /pedestrian|walk|bicycle|bike|cycl/.test(l.g);
      const dark = l.face === 'black' || (l.face == null && (l.c === 'white' || figure));
      const face = l.face === 'color' ? lampCol : dark ? PALETTE.black : (on && !l.g ? lampCol : PALETTE.white);
      out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${face}" stroke="${PALETTE.black}" stroke-width="1.4"${flash && !l.g ? ' class="lamp-flash"' : ''}/>`;
      if (l.g) {
        const sc = (r * 1.7) / 100;
        const gcol = on ? lampCol : (dark ? '#8a8a8a' : '#bdbdbd');
        out += `<g transform="translate(${cx} ${cy})${l.rot ? ` rotate(${l.rot})` : ''} scale(${l.flip ? -sc : sc} ${sc}) translate(-50 -50)"${flash ? ' class="lamp-flash"' : ''}>${D.glyphs.markup(l.g, () => gcol)}</g>`;
      }
    });
    return out;
  }

  // the official picture of a sign, if the pack has one: { w, h, src, alt? }
  SG.art = (s) => (s && D.data && D.data.signArt && D.data.signArt[String(s.num)]) || null;
  // every form the chart shows for a sign — its picture first, then the others
  SG.forms = (s) => { const a = SG.art(s); return a ? [a].concat(a.alt || []) : []; };

  // a picture as an <svg>: height = size, the width from the picture's own
  // proportions (a very wide one — a road marking — shrinks to fit 2.4 × size)
  SG.imageSVG = (a, size, label) => {
    let h = size, w = size * a.w / a.h;
    if (w > size * 2.4) { w = size * 2.4; h = w * a.h / a.w; }
    const src = esc(a.src);
    return `<svg class="sign-svg sign-art" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${a.w} ${a.h}" width="${Math.round(w)}" height="${Math.round(h)}" role="img" aria-label="${label}"><image href="${src}" xlink:href="${src}" width="${a.w}" height="${a.h}"/></svg>`;
  };

  // the sign as an SVG string: its official picture, else its drawing
  // (opts.drawn = true asks for the drawing even when there is a picture)
  SG.svg = (s, opts) => {
    opts = opts || {};
    if (!s) return '';
    const size = opts.size || 96;
    const label = esc(D.tr(s.name) || s.num);
    const art = opts.drawn ? null : SG.art(s);
    if (art) return SG.imageSVG(art, size, label);
    if (s.svg) {
      return String(s.svg).replace(/<svg\b/, `<svg width="${size}" height="${size}" role="img" aria-label="${label}"`);
    }
    const d = DEFAULTS[s.cat] || DEFAULTS.other;
    const shape = s.shape || d.shape;
    const cols = Object.assign({}, { field: d.field, border: d.border, symbol: d.symbol }, s.colors || {});
    const roles = {
      field: col(cols.field, {}, PALETTE[d.field]), border: col(cols.border, {}, PALETTE[d.border]), symbol: col(cols.symbol, {}, PALETTE[d.symbol]),
      _thinBorder: shape === 'circle' && (s.cat === 'mandatory' || cols.thin)
    };
    roles.symbol = col(cols.symbol, roles, PALETTE[d.symbol]);
    const W = (s.w || (shape === 'rect' || shape === 'plate' ? 1.5 : 1)) * 100;
    const clipId = 'c' + D.util.hash(String(s.num) + (opts.salt || '')).toString(36);
    let body = '';
    if (shape === 'light') body = lightSVG(s, roles);
    else {
      body = shapeSVG(shape, roles, W);
      body += (s.draw || []).map((it) => itemSVG(it, roles, shape === 'circle' ? clipId : null)).join('');
    }
    const clip = shape === 'circle' ? `<defs><clipPath id="${clipId}"><circle cx="50" cy="50" r="38"/></clipPath></defs>` : '';
    const wpx = Math.round(size * W / 100);
    return `<svg class="sign-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 100" width="${wpx}" height="${size}" role="img" aria-label="${label}">${clip}${body}</svg>`;
  };

  // pack-supplied glyphs join the library when a pack loads
  D.on('content', (data) => {
    const g = data && data.pack && data.pack.files['signs.json'] && data.pack.files['signs.json'].glyphs;
    if (g) Object.keys(g).forEach((k) => D.glyphs.add(k, g[k]));
  });

  SG.series = () => D.data.series;
  SG.inSeries = (id) => D.data.signs.filter((s) => (id ? String(s.series) === String(id) : true));
})(globalThis.Drive = globalThis.Drive || {});
