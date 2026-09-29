/* Hyper Driving · signs.js — draws a traffic sign, road marking or traffic
 * light. Everything comes from the content pack, so an authority can change or
 * add signs through a content update:
 *
 *   sign-art.json  the sign's picture(s): the Ministry's sign chart, traced to
 *                  vector outlines (HYPER-DRIVING/DRIVING-SIGNS, imported by
 *                  tools/import-sign-art.js). Used whenever a sign has one.
 *   signs.json     a drawing described as a shape, colours and drawing items:
 *                  used for a sign the chart has no picture of (and in the editor).
 *
 * A picture (sign-art.json → art[num] = [picture, …], in the chart's order):
 *   { "w": 1488, "h": 1248, "pt": [60.75, 51], "page": 7, "layers": [["#f00", "M…"], …] }
 *   layers are filled even-odd, bottom first, in a w × h box; paths use relative
 *   commands on an integer grid (SG.pictureFromSVG writes them).
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

  // ---------- pictures (sign-art.json) ----------
  // the pictures of a sign number, or null
  SG.art = (num) => {
    const a = D.data && D.data.signArt && D.data.signArt[String(num)];
    return Array.isArray(a) && a.length ? a : null;
  };

  const COLOR_RE = /^(#[0-9a-f]{3,8}|[a-z]+)$/i;
  const PATH_RE = /^[MmLlCcQqZz0-9\s,.-]*$/;

  // one picture as an SVG string. It is as tall as `size`, or narrower than
  // size × maxW when it is wider than that (a long direction sign).
  SG.pictureSVG = (pic, opts) => {
    opts = opts || {};
    if (!pic || !(pic.w > 0 && pic.h > 0)) return '';
    const size = opts.size || 96, maxW = opts.maxW || 1.6;
    const a = pic.w / pic.h;
    let h = size, w = size * a;
    if (w > size * maxW) { w = size * maxW; h = w / a; }
    const body = (pic.layers || []).filter((l) => COLOR_RE.test(l[0]) && PATH_RE.test(l[1]))
      .map((l) => `<path fill="${l[0]}"${l[2] === 'nonzero' ? '' : ' fill-rule="evenodd"'} d="${l[1]}"/>`).join('');
    return `<svg class="sign-svg sign-pic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pic.w} ${pic.h}" width="${Math.round(w)}" height="${Math.round(h)}" role="img"${opts.label ? ` aria-label="${opts.label}"` : ''}>${body}</svg>`;
  };

  // An SVG file → a picture. Takes <path> elements with a fill (the traced files
  // of DRIVING-SIGNS, or any drawing made of filled paths without transforms),
  // and rewrites them in `units` per unit of the file (or so that the longer side
  // is 3000 units): relative commands, whole numbers.
  SG.pictureFromSVG = (text, opts) => {
    opts = opts || {};
    text = String(text || '');
    const root = (text.match(/<svg\b[^>]*>/i) || [])[0];
    if (!root) throw new Error('not an SVG file');
    const attr = (tag, k) => { const m = tag.match(new RegExp('\\s' + k + '\\s*=\\s*("([^"]*)"|\'([^\']*)\')')); return m ? (m[2] != null ? m[2] : m[3]) : null; };
    const body = text.replace(/<(title|desc|metadata)\b[\s\S]*?<\/\1>/gi, '');
    const other = body.match(/<(rect|circle|ellipse|line|polyline|polygon|text|image|use|g)\b/i);
    if (other) throw new Error('only <path> elements can be read, not <' + other[1] + '>');
    if (/\stransform\s*=/.test(body)) throw new Error('paths with a transform cannot be read');
    let vb = (attr(root, 'viewBox') || '').trim().split(/[\s,]+/).map(Number);
    if (vb.length !== 4 || vb.some(isNaN)) vb = [0, 0, parseFloat(attr(root, 'width')), parseFloat(attr(root, 'height'))];
    const [x0, y0, vw, vh] = vb;
    if (!(vw > 0 && vh > 0)) throw new Error('the SVG has no size');
    const k = opts.units || 3000 / Math.max(vw, vh);
    const layers = [];
    (body.match(/<path\b[^>]*>/gi) || []).forEach((tag) => {
      const d = attr(tag, 'd'); if (!d) return;
      const style = attr(tag, 'style') || '';
      const sf = style.match(/fill\s*:\s*([^;]+)/), sr = style.match(/fill-rule\s*:\s*([^;]+)/);
      const fill = ((sf && sf[1]) || attr(tag, 'fill') || '#000').trim().toLowerCase();
      if (fill === 'none') throw new Error('a path without a fill (an outline) cannot be read');
      if (!COLOR_RE.test(fill)) throw new Error('unknown colour "' + fill + '"');
      const rule = ((sr && sr[1]) || attr(tag, 'fill-rule') || 'nonzero').trim();
      const enc = encodePath(d, k, x0, y0);
      if (enc) layers.push(rule === 'evenodd' ? [fill, enc] : [fill, enc, 'nonzero']);
    });
    if (!layers.length) throw new Error('no filled paths');
    return { w: Math.round(vw * k), h: Math.round(vh * k), layers };
  };

  // a path → relative commands on the integer grid: each point is rounded where
  // it lies, and a step is the difference of two rounded points, so rounding
  // never adds up along the path. Arcs are not supported.
  function encodePath(d, k, x0, y0) {
    const tok = String(d).match(/[a-df-z]|[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) || [];
    let i = 0, cmd = '', out = '', last = '';
    let cx = 0, cy = 0, sx = 0, sy = 0;        // current and subpath start, in file units
    let rx = 0, ry = 0, rsx = 0, rsy = 0;      // the same, rounded
    let pcx = null, pcy = null, pq = null;     // last control points (for S and T)
    const n = () => { const v = +tok[i++]; if (isNaN(v)) throw new Error('bad path data'); return v; };
    const R = (v, o) => Math.round((v - o) * k);
    const emit = (c, nums) => {
      let s = '';
      nums.forEach((v, j) => { const t = String(v); s += (j === 0 ? '' : (t[0] === '-' ? '' : ' ')) + t; });
      if (c === last && c !== 'M') out += (s[0] === '-' ? '' : ' ') + s;
      else out += c + s;
      last = c;
    };
    const line = (x, y) => {
      const X = R(x, x0), Y = R(y, y0);
      if (X !== rx || Y !== ry) emit('l', [X - rx, Y - ry]);
      cx = x; cy = y; rx = X; ry = Y;
    };
    const cubic = (x1, y1, x2, y2, x, y) => {
      const p = [R(x1, x0), R(y1, y0), R(x2, x0), R(y2, y0), R(x, x0), R(y, y0)];
      const rel = [p[0] - rx, p[1] - ry, p[2] - rx, p[3] - ry, p[4] - rx, p[5] - ry];
      if (rel.some((v) => v !== 0)) emit('c', rel);
      pcx = x2; pcy = y2; cx = x; cy = y; rx = p[4]; ry = p[5];
    };
    const quad = (x1, y1, x, y) => {
      const p = [R(x1, x0), R(y1, y0), R(x, x0), R(y, y0)];
      const rel = [p[0] - rx, p[1] - ry, p[2] - rx, p[3] - ry];
      if (rel.some((v) => v !== 0)) emit('q', rel);
      pq = [x1, y1]; cx = x; cy = y; rx = p[2]; ry = p[3];
    };
    while (i < tok.length) {
      if (/[a-z]/i.test(tok[i])) cmd = tok[i++];
      else if (!cmd) throw new Error('bad path data');
      const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
      const ox = rel ? cx : 0, oy = rel ? cy : 0;
      const keepC = C === 'C' || C === 'S', keepQ = C === 'Q' || C === 'T';
      if (C === 'Z') {
        emit('z', []); cx = sx; cy = sy; rx = rsx; ry = rsy;
      } else if (C === 'M') {
        cx = n() + ox; cy = n() + oy; sx = cx; sy = cy;
        rx = rsx = R(cx, x0); ry = rsy = R(cy, y0);
        emit('M', [rx, ry]);
        cmd = rel ? 'l' : 'L';   // further pairs are lines
      } else if (C === 'L') line(n() + ox, n() + oy);
      else if (C === 'H') line(n() + ox, cy);
      else if (C === 'V') line(cx, n() + (rel ? cy : 0));
      else if (C === 'C') { const a = [n() + ox, n() + oy, n() + ox, n() + oy, n() + ox, n() + oy]; cubic(...a); }
      else if (C === 'S') {
        const x1 = pcx != null ? 2 * cx - pcx : cx, y1 = pcy != null ? 2 * cy - pcy : cy;
        const a = [n() + ox, n() + oy, n() + ox, n() + oy]; cubic(x1, y1, ...a);
      } else if (C === 'Q') { const a = [n() + ox, n() + oy, n() + ox, n() + oy]; quad(...a); }
      else if (C === 'T') {
        const q1 = pq ? [2 * cx - pq[0], 2 * cy - pq[1]] : [cx, cy];
        quad(q1[0], q1[1], n() + ox, n() + oy);
      } else throw new Error('path command "' + cmd + '" is not supported');
      if (!keepC) { pcx = pcy = null; }
      if (!keepQ) pq = null;
    }
    return out;
  }

  // the sign as an SVG string: its picture when it has one (opts.pic picks one
  // of several), else its drawing (opts.drawn: always the drawing)
  SG.svg = (s, opts) => {
    opts = opts || {};
    if (!s) return '';
    const size = opts.size || 96;
    const label = esc(D.tr(s.name) || s.num);
    if (s.svg) {
      return String(s.svg).replace(/<svg\b/, `<svg width="${size}" height="${size}" role="img" aria-label="${label}"`);
    }
    const pics = !opts.drawn && SG.art(s.num);
    if (pics) return SG.pictureSVG(pics[Math.min(opts.pic || 0, pics.length - 1)], { size, label, maxW: opts.maxW });
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
