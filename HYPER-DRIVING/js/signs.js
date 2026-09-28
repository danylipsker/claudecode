/* Hyper Driving · signs.js — draws a traffic sign, road marking or traffic
 * light from its description in signs.json. Nothing is a picture file: a sign
 * is a shape, colours and a list of drawing items, so an authority can change
 * or add signs through a content update.
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

  const PALETTE = {
    red: '#CC1F2F', blue: '#0B5CAD', green: '#00804A', yellow: '#FFC80A', orange: '#F28C00',
    brown: '#6E3B1F', black: '#161616', white: '#FFFFFF', grey: '#8A8F98', asphalt: '#474C55',
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
        const inner = inset(TRI_UP, 0.70);
        return `<path d="${poly(TRI_UP)}" fill="${b}" stroke="${b}" stroke-width="6" stroke-linejoin="round"/>` +
          `<path d="${poly(inner)}" fill="${f}" stroke="${f}" stroke-width="2" stroke-linejoin="round"/>`;
      }
      case 'triangle-down': {
        const inner = inset(TRI_DOWN, 0.70);
        return `<path d="${poly(TRI_DOWN)}" fill="${b}" stroke="${b}" stroke-width="6" stroke-linejoin="round"/>` +
          `<path d="${poly(inner)}" fill="${f}" stroke="${f}" stroke-width="2" stroke-linejoin="round"/>`;
      }
      case 'circle':
        if (roles._thinBorder) return `<circle cx="50" cy="50" r="48" fill="${b}"/><circle cx="50" cy="50" r="45" fill="${f}"/>`;
        return `<circle cx="50" cy="50" r="48" fill="${b}"/><circle cx="50" cy="50" r="37.5" fill="${f}"/>`;
      case 'octagon':
        return `<path d="${poly(octagon(49, 50, 50))}" fill="${b}"/><path d="${poly(octagon(45.5, 50, 50))}" fill="${f}"/>`;
      case 'diamond':
        return `<path d="M50 2 L98 50 L50 98 L2 50 Z" fill="${b}" stroke="${b}" stroke-width="2" stroke-linejoin="round"/><path d="M50 9 L91 50 L50 91 L9 50 Z" fill="${f}"/>`;
      case 'square':
        return `<rect x="2" y="2" width="96" height="96" rx="9" fill="${b}"/><rect x="5.5" y="5.5" width="89" height="89" rx="6.5" fill="${f}"/>`;
      case 'rect':
        return `<rect x="1.5" y="1.5" width="${W - 3}" height="97" rx="8" fill="${b}"/><rect x="5" y="5" width="${W - 10}" height="90" rx="5.5" fill="${f}"/>`;
      case 'plate':
        return `<rect x="1.5" y="1.5" width="${W - 3}" height="97" rx="6" fill="${b}"/><rect x="5" y="5" width="${W - 10}" height="90" rx="3.5" fill="${f}"/>`;
      case 'marking':
        return `<rect x="0" y="0" width="${W}" height="100" rx="6" fill="${f}"/>`;
      case 'none':
        return '';
      default:
        return `<rect x="2" y="2" width="96" height="96" rx="9" fill="${b}"/><rect x="5.5" y="5.5" width="89" height="89" rx="6.5" fill="${f}"/>`;
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

  function lightSVG(s, roles) {
    const lamps = s.lamps || [];
    const n = Math.max(1, lamps.length);
    const W = s.w ? s.w * 100 : 100;
    const horiz = !!s.horizontal;
    let r = horiz ? Math.min(16, (W - 20) / (2 * n) - 2) : Math.min(15, 90 / (2 * n) - 2.5);
    let out = '';
    let hw = horiz ? W - 8 : 2 * r + 18;
    let hh = horiz ? 2 * r + 18 : 96;
    // a single-lamp head (pedestrian, cyclist, tram, beacon) is a square box
    // with a large lamp, so the figure inside it reads at small sizes
    if (n === 1) { hw = hh = Math.min(W, 100) - 10; r = hw * 0.38; }
    const hx = (W - hw) / 2, hy = (100 - hh) / 2;
    out += `<rect x="${hx}" y="${hy}" width="${hw}" height="${hh}" rx="${Math.min(14, hw / 3)}" fill="${PALETTE.darkgrey}" stroke="${PALETTE.black}" stroke-width="2"/>`;
    lamps.forEach((l, i) => {
      const cx = horiz ? hx + (hw / n) * (i + 0.5) : W / 2;
      const cy = horiz ? 50 : hy + (hh / n) * (i + 0.5);
      const lampCol = { red: PALETTE.lampred, yellow: PALETTE.lampyellow, green: PALETTE.lampgreen, white: '#F4F4F4' }[l.c] || col(l.c, roles);
      const on = !!l.on;
      const flash = (s.flash || []).includes(i);
      out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${on && !l.g ? lampCol : PALETTE.lamp_off}"${flash ? ' class="lamp-flash"' : ''}/>`;
      if (on && !l.g) out += `<circle cx="${cx - r * 0.3}" cy="${cy - r * 0.3}" r="${r * 0.28}" fill="#fff" opacity=".35"/>`;
      if (l.g) {
        const sc = (r * 1.7) / 100;
        out += `<g transform="translate(${cx} ${cy})${l.rot ? ` rotate(${l.rot})` : ''} scale(${l.flip ? -sc : sc} ${sc}) translate(-50 -50)"${flash ? ' class="lamp-flash"' : ''}>${D.glyphs.markup(l.g, () => (on ? lampCol : '#55585f'))}</g>`;
      }
    });
    return out;
  }

  // the sign as an SVG string
  SG.svg = (s, opts) => {
    opts = opts || {};
    if (!s) return '';
    const size = opts.size || 96;
    const label = esc(D.tr(s.name) || s.num);
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
