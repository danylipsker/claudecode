/* The Puzzle Cabinet · js/lib/visual-gen.js
 *
 * Visual reasoning, made and checked by the computer:
 *   - figures drawn as SVG markup (theme tokens, so they read in day and night),
 *   - the rules of matrices (per row / column) and of sequences, with an
 *     inference that lists every rule consistent with what is shown, so a
 *     puzzle is kept only when exactly one candidate obeys all of them,
 *   - odd-one-out properties with a check that no other obvious property
 *     singles out a different figure,
 *   - the fold-and-punch paper model (faces with reflections) and mirror images,
 *   - spot-the-difference scenes built from parts (in the second half of the file).
 * Pure functions only: it loads in node, where tools/gen and validate use it.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const V = C.Visual = C.Visual || {};

  /* ---------- small helpers ---------- */

  const RAD = Math.PI / 180;
  const INK = 'var(--ink)';
  const n1 = (v) => Math.round(v * 10) / 10;
  const range = (a, b) => { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; };
  const popcount = (m) => { let c = 0; while (m) { c += m & 1; m >>>= 1; } return c; };
  const uniq = (a) => a.filter((v, i) => a.indexOf(v) === i);
  const LETTERS = 'ABCDEFGHIJ';
  function pathOf(poly, open) {
    let d = '';
    poly.forEach((p, i) => { d += (i ? 'L' : 'M') + n1(p[0]) + ' ' + n1(p[1]); });
    return open ? d : d + 'Z';
  }
  // place a unit polygon: scale r, mirror (flip), turn deg clockwise (screen), move to (cx, cy)
  function xf(poly, cx, cy, r, deg, flip) {
    const c = Math.cos((deg || 0) * RAD), s = Math.sin((deg || 0) * RAD);
    return poly.map(([x, y]) => { x *= flip ? -r : r; y *= r; return [cx + x * c - y * s, cy + x * s + y * c]; });
  }
  function regular(n, R, a0) {
    const out = [];
    for (let i = 0; i < n; i++) { const a = (a0 + i * 360 / n) * RAD; out.push([R * Math.cos(a), R * Math.sin(a)]); }
    return out;
  }
  function boxCentre(poly) {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    poly.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return poly.map(([x, y]) => [x - cx, y - cy]);
  }
  function starPts(k, R, r) {
    const o = [];
    for (let i = 0; i < 2 * k; i++) { const a = (-90 + i * 180 / k) * RAD, q = i % 2 ? r : R; o.push([q * Math.cos(a), q * Math.sin(a)]); }
    return o;
  }
  function areaOf(poly) {
    let a = 0;
    for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; a += p[0] * q[1] - q[0] * p[1]; }
    return a / 2;
  }
  function centroidOf(poly) {
    let a = 0, x = 0, y = 0;
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length], w = p[0] * q[1] - q[0] * p[1];
      a += w; x += (p[0] + q[0]) * w; y += (p[1] + q[1]) * w;
    }
    if (Math.abs(a) < 1e-12) return [poly[0][0], poly[0][1]];
    return [x / (3 * a), y / (3 * a)];
  }
  function inPoly(pt, poly) {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
    }
    return c;
  }
  function segDist(p, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
    let t = L ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L : 0;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
  }
  function edgeDist(p, poly) {
    let m = Infinity;
    for (let i = 0; i < poly.length; i++) m = Math.min(m, segDist(p, poly[i], poly[(i + 1) % poly.length]));
    return m;
  }
  function isConvex(poly) {
    let sign = 0;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], c = poly[(i + 2) % poly.length];
      const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
      if (Math.abs(cr) < 1e-9) continue;
      if (!sign) sign = Math.sign(cr); else if (Math.sign(cr) !== sign) return false;
    }
    return true;
  }
  // the smallest turn (degrees) at any corner, and the shortest side: a polygon reads well when both are large enough
  function cornerQuality(poly) {
    let turn = 180, side = Infinity;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[(i + poly.length - 1) % poly.length], b = poly[i], c = poly[(i + 1) % poly.length];
      const u = [b[0] - a[0], b[1] - a[1]], w = [c[0] - b[0], c[1] - b[1]];
      const ang = Math.abs(Math.atan2(u[0] * w[1] - u[1] * w[0], u[0] * w[0] + u[1] * w[1])) / RAD;
      turn = Math.min(turn, ang);
      side = Math.min(side, Math.hypot(w[0], w[1]));
    }
    return { turn, side };
  }

  /* ---------- shapes (unit size, centred) ---------- */

  function pac() {
    const o = [[0, .12]];
    for (let a = -55; a <= 235; a += 10) o.push([Math.cos(a * RAD), Math.sin(a * RAD)]);
    return o;
  }
  function drop() {
    const o = [[0, -1.12]], c = .3, r = .66;
    for (let a = -28; a <= 208; a += 8) o.push([r * Math.cos(a * RAD), c + r * Math.sin(a * RAD)]);
    return boxCentre(o);
  }
  const cw = .31;
  const UNIT = {
    circle: regular(40, 1, -90),
    square: [[-.84, -.84], [.84, -.84], [.84, .84], [-.84, .84]],
    triangle: boxCentre(regular(3, 1.14, -90)),
    diamond: [[0, -1.1], [.78, 0], [0, 1.1], [-.78, 0]],
    pentagon: boxCentre(regular(5, 1.04, -90)),
    hexagon: regular(6, 1, 0),
    star: boxCentre(starPts(5, 1.16, .5)),
    cross: [[-cw, -.95], [cw, -.95], [cw, -cw], [.95, -cw], [.95, cw], [cw, cw], [cw, .95], [-cw, .95], [-cw, cw], [-.95, cw], [-.95, -cw], [-cw, -cw]],
    arrow: [[-.25, 1], [.25, 1], [.25, -.06], [.66, -.06], [0, -1], [-.66, -.06], [-.25, -.06]],
    pac: pac(),
    drop: drop(),
    kite: [[0, -1.1], [.64, -.28], [0, 1.05], [-.64, -.28]]
  };
  // a regular polygon of n sides standing on a flat side
  const NGON = {};
  function ngon(n) { return NGON[n] || (NGON[n] = boxCentre(regular(n, 1.02, 90 + 180 / n))); }
  const PLURAL = { circle: 'circles', square: 'squares', triangle: 'triangles', diamond: 'diamonds', pentagon: 'pentagons', hexagon: 'hexagons', star: 'stars', cross: 'crosses', arrow: 'arrows', pac: 'wedged circles', drop: 'drops', kite: 'kites' };
  const GLYPHW = { arrow: 'arrow', pac: 'wedged circle', drop: 'drop', kite: 'kite' };
  const SIDEW = { 3: 'triangle', 4: 'square', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon' };
  const NUMW = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const FILLW = ['empty', 'striped', 'grey', 'solid'];
  const SIZEW = ['small', 'medium', 'large'];
  const DIRW = ['up', 'up and right', 'right', 'down and right', 'down', 'down and left', 'left', 'up and left'];
  const ARROWS = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];

  /* ---------- fills: empty, striped, grey, solid ---------- */

  // straight hatching lines inside a polygon (no SVG patterns: no ids to clash)
  function hatch(poly, sp, deg) {
    const a = (deg == null ? 45 : deg) * RAD, c = Math.cos(a), s = Math.sin(a);
    const P = poly.map(([x, y]) => [x * c + y * s, -x * s + y * c]);
    let y0 = Infinity, y1 = -Infinity;
    P.forEach((p) => { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
    const n = Math.floor((y1 - y0) / sp), start = y0 + ((y1 - y0) - n * sp) / 2;
    let d = '';
    for (let k = 0; k <= n; k++) {
      const y = start + k * sp;
      if (y <= y0 + .05 || y >= y1 - .05) continue;
      const xs = [];
      for (let i = 0; i < P.length; i++) {
        const p = P[i], q = P[(i + 1) % P.length];
        if ((p[1] <= y) !== (q[1] <= y)) xs.push(p[0] + (y - p[1]) * (q[0] - p[0]) / (q[1] - p[1]));
      }
      xs.sort((u, v) => u - v);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        d += 'M' + n1(xs[i] * c - y * s) + ' ' + n1(xs[i] * s + y * c) + 'L' + n1(xs[i + 1] * c - y * s) + ' ' + n1(xs[i + 1] * s + y * c);
      }
    }
    return d;
  }
  function fillShape(poly, fill, o, circ) {
    o = o || {};
    const col = o.col || INK, sw = o.sw || 3;
    const tag = circ ? '<circle cx="' + n1(circ[0]) + '" cy="' + n1(circ[1]) + '" r="' + n1(circ[2]) + '"' : '<path d="' + pathOf(poly) + '"';
    const st = ' stroke="' + col + '" stroke-width="' + n1(sw) + '" stroke-linejoin="round"';
    if (fill === 3) return tag + ' fill="' + col + '"' + st + '/>';
    if (fill === 2) return tag + ' fill="' + col + '" fill-opacity=".4"' + st + '/>';
    let s = '';
    if (fill === 1) s = '<path d="' + hatch(poly, o.hs || 5.4, 45) + '" fill="none" stroke="' + col + '" stroke-width="' + n1(sw * .55) + '"/>';
    return s + tag + ' fill="none"' + st + '/>';
  }
  function drawShape(name, cx, cy, r, deg, fill, o) {
    const unit = UNIT[name] || ngon(+name);
    const poly = xf(unit, cx, cy, r, deg || 0);
    return fillShape(poly, fill, o, name === 'circle' ? [cx, cy, r] : null);
  }
  function svgWrap(inner, vb, extra) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (vb || '-4 -4 108 108') + '"' + (extra || '') + '>' + inner + '</svg>';
  }

  /* ---------- figure layouts for matrices and sequences ----------
   * A figure is a small object of attribute values; the layout draws it in a
   * 100 × 100 box. Attribute kinds: cat (a set of names), ord (a range of whole
   * numbers), mod (a cycle, like the 8 compass directions), set (a bit mask:
   * which lines, which places). Sets carry the permutation a quarter turn makes. */

  const BIG = ['circle', 'square', 'triangle', 'diamond', 'pentagon', 'hexagon', 'star', 'cross'];
  const SMALL = ['circle', 'square', 'triangle', 'diamond', 'star', 'cross'];
  const OUTER = ['circle', 'square', 'triangle', 'diamond', 'pentagon', 'hexagon'];
  const INNER = ['circle', 'square', 'triangle', 'diamond', 'star', 'cross'];
  const DOTSIN = ['circle', 'square', 'hexagon', 'pentagon'];
  const GLYPHS = ['arrow', 'pac', 'drop', 'kite'];
  const RINGC = ['triangle', 'diamond', 'star', 'cross'];
  const F4 = [0, 1, 2, 3], F3 = [0, 2, 3];
  const cat = (k, name, dom, x) => Object.assign({ k, name, t: 'cat', dom }, x);
  const ord = (k, name, lo, hi, x) => Object.assign({ k, name, t: 'ord', lo, hi, dom: range(lo, hi) }, x);
  const mod = (k, name, m, x) => Object.assign({ k, name, t: 'mod', m, dom: range(0, m - 1) }, x);
  const set = (k, name, bits, perm, x) => Object.assign({ k, name, t: 'set', bits, perm, dom: null }, x);

  const DICE = [null,
    [[0, 0]],
    [[-1, -1], [1, 1]],
    [[-1, -1], [0, 0], [1, 1]],
    [[-1, -1], [1, -1], [-1, 1], [1, 1]],
    [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
    [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
    [[-1, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [1, 1]],
    [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]],
    [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
  ];
  // 3 × 3 places, read like a book; a quarter turn clockwise sends (r, c) to (c, 2 − r)
  const PERM9 = range(0, 8).map((i) => { const r = Math.floor(i / 3), c = i % 3; return c * 3 + (2 - r); });
  // eight lines in a square frame: two diagonals, two middle lines, the four sides of the inner diamond
  const Q0 = 16, Q1 = 84, QM = 50;
  const SEG8 = [
    [[Q0, Q0], [Q1, Q1]], [[Q1, Q0], [Q0, Q1]], [[QM, Q0], [QM, Q1]], [[Q0, QM], [Q1, QM]],
    [[QM, Q0], [Q1, QM]], [[Q1, QM], [QM, Q1]], [[QM, Q1], [Q0, QM]], [[Q0, QM], [QM, Q0]]
  ];
  const PERM8 = [1, 0, 3, 2, 5, 6, 7, 4];
  // the eight places around the edge of a 3 × 3 box, clockwise from the top left
  const RING = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]];
  const ringXY = (i) => [22 + RING[i][0] * 28, 22 + RING[i][1] * 28];

  function slotGuides(pts, r) {
    return pts.map(([x, y]) => '<circle cx="' + n1(x) + '" cy="' + n1(y) + '" r="' + r + '" fill="none" stroke="var(--grid-2)" stroke-width="1.6"/>').join('');
  }
  function outlineOf(name, R) { return xf(UNIT[name], 50, 50, R, 0); }

  // o (drawing options): { col: colour for everything, cols: { attrKey: colour } (highlight one attribute), elem(i): colour of set element i }
  const colOf = (o, k) => (o && o.cols && o.cols[k]) || (o && o.col) || INK;

  const LAY = {
    one: {
      attrs: [cat('s', 'shape', BIG), ord('z', 'size', 0, 2), cat('f', 'shading', F4)],
      draw(a, o) { return drawShape(a.s, 50, 50, [19, 28, 38][a.z], 0, a.f, { col: colOf(o, 's'), sw: 3.2 }); },
      desc(a) { return 'a ' + SIZEW[a.z] + ' ' + FILLW[a.f] + ' ' + a.s; }
    },
    poly: {
      attrs: [ord('n', 'number of sides', 3, 8), ord('z', 'size', 0, 2), cat('f', 'shading', F4)],
      draw(a, o) { return fillShape(xf(ngon(a.n), 50, 50, [21, 29, 38][a.z], 0), a.f, { col: colOf(o, 'n'), sw: 3.2 }); },
      desc(a) { return 'a ' + SIZEW[a.z] + ' ' + FILLW[a.f] + ' ' + SIDEW[a.n] + ' (' + a.n + ' sides)'; }
    },
    nest: {
      attrs: [cat('o', 'outer shape', OUTER), cat('s', 'inner shape', INNER), cat('f', 'inner shading', F3)],
      draw(a, o) {
        const out = outlineOf(a.o, a.o === 'triangle' ? 46 : 42);
        const c = a.o === 'triangle' ? centroidOf(out) : [50, 50];
        return fillShape(out, 0, { col: colOf(o, 'o'), sw: 3 }, a.o === 'circle' ? [50, 50, 42] : null) +
          drawShape(a.s, c[0], c[1] + (a.o === 'triangle' ? 3 : 0), 14, 0, a.f, { col: colOf(o, 's'), sw: 2.8 });
      },
      desc(a) { return 'a ' + FILLW[a.f] + ' ' + a.s + ' inside a ' + a.o; }
    },
    many: {
      attrs: [cat('s', 'shape', SMALL, { plural: true }), ord('n', 'number of shapes', 1, 9), cat('f', 'shading', F3)],
      draw(a, o) {
        return DICE[a.n].map(([dx, dy]) => drawShape(a.s, 50 + dx * 28, 50 + dy * 28, 10.5, 0, a.f, { col: colOf(o, 's'), sw: 2.6 })).join('');
      },
      desc(a) { return NUMW[a.n] + ' ' + FILLW[a.f] + ' ' + (a.n === 1 ? a.s : PLURAL[a.s]); }
    },
    dotsin: {
      attrs: [cat('o', 'outline', DOTSIN), ord('n', 'number of dots', 1, 9), cat('f', 'dots', [0, 3])],
      draw(a, o) {
        const R = a.o === 'pentagon' ? 47 : 44;
        let s = fillShape(outlineOf(a.o, R), 0, { col: colOf(o, 'o'), sw: 3 }, a.o === 'circle' ? [50, 50, R] : null);
        const cy = a.o === 'pentagon' ? 52 : 50;
        DICE[a.n].forEach(([dx, dy]) => { s += drawShape('circle', 50 + dx * 15.5, cy + dy * 15.5, 5.2, 0, a.f, { col: colOf(o, 'n'), sw: 2.2 }); });
        return s;
      },
      fits(a) {
        const R = a.o === 'pentagon' ? 47 : 44, out = outlineOf(a.o, R), cy = a.o === 'pentagon' ? 52 : 50;
        return DICE[a.n].every(([dx, dy]) => { const p = [50 + dx * 15.5, cy + dy * 15.5]; return inPoly(p, out) && edgeDist(p, out) >= 7.5; });
      },
      desc(a) { return 'a ' + a.o + ' holding ' + NUMW[a.n] + ' ' + (a.f ? 'solid' : 'hollow') + ' dot' + (a.n === 1 ? '' : 's'); }
    },
    glyph: {
      attrs: [cat('g', 'figure', GLYPHS, { fixed: true }), mod('a', 'direction', 8), cat('f', 'shading', F4), ord('z', 'size', 0, 2)],
      draw(a, o) { return drawShape(a.g, 50, 50, [23, 31, 40][a.z], a.a * 45, a.f, { col: colOf(o, 'a'), sw: 3 }); },
      desc(a) { return 'a ' + SIZEW[a.z] + ' ' + FILLW[a.f] + ' ' + GLYPHW[a.g] + ' pointing ' + DIRW[a.a]; }
    },
    clock: {
      attrs: [mod('a', 'long hand', 8), mod('b', 'short hand', 8)],
      draw(a, o) {
        let s = '<circle cx="50" cy="50" r="42" fill="none" stroke="var(--ink-2)" stroke-width="2.6"/>';
        for (let i = 0; i < 8; i++) { const u = [Math.sin(i * 45 * RAD), -Math.cos(i * 45 * RAD)]; s += '<path d="M' + n1(50 + u[0] * 36) + ' ' + n1(50 + u[1] * 36) + 'L' + n1(50 + u[0] * 41) + ' ' + n1(50 + u[1] * 41) + '" stroke="var(--ink-2)" stroke-width="2.4"/>'; }
        const hand = (k, len, w, col, head) => {
          const u = [Math.sin(k * 45 * RAD), -Math.cos(k * 45 * RAD)], p = [-u[1], u[0]];
          const tip = [50 + u[0] * len, 50 + u[1] * len];
          let h = '<path d="M50 50L' + n1(tip[0] - u[0] * (head ? 7 : 0)) + ' ' + n1(tip[1] - u[1] * (head ? 7 : 0)) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>';
          if (head) h += '<path d="' + pathOf([tip, [tip[0] - u[0] * 11 + p[0] * 6, tip[1] - u[1] * 11 + p[1] * 6], [tip[0] - u[0] * 11 - p[0] * 6, tip[1] - u[1] * 11 - p[1] * 6]]) + '" fill="' + col + '" stroke="' + col + '" stroke-width="1.5" stroke-linejoin="round"/>';
          else h += '<circle cx="' + n1(tip[0]) + '" cy="' + n1(tip[1]) + '" r="5" fill="' + col + '"/>';
          return h;
        };
        return s + hand(a.a, 35, 4, colOf(o, 'a'), true) + hand(a.b, 21, 6, colOf(o, 'b'), false) + '<circle cx="50" cy="50" r="4.5" fill="' + INK + '"/>';
      },
      desc(a) { return 'the long hand pointing ' + DIRW[a.a] + ' and the short hand pointing ' + DIRW[a.b]; }
    },
    grid: {
      attrs: [set('p', 'places', 9, PERM9, { pmin: 2, pmax: 5, items: 'shapes', item: 'shape' }), cat('s', 'shape', SMALL, { plural: true }), cat('f', 'shading', F3)],
      draw(a, o) {
        const pts = range(0, 8).map((i) => [22 + (i % 3) * 28, 22 + Math.floor(i / 3) * 28]);
        let s = slotGuides(pts, 12);
        pts.forEach((p, i) => { if (a.p & (1 << i)) s += drawShape(a.s, p[0], p[1], 10, 0, a.f, { col: (o && o.elem && o.elem(i)) || colOf(o, 's'), sw: 2.6 }); });
        return s;
      },
      desc() { return null; }
    },
    lines: {
      attrs: [set('l', 'lines', 8, PERM8, { pmin: 2, pmax: 4, items: 'lines', item: 'line' })],
      draw(a, o) {
        let s = '<rect x="' + Q0 + '" y="' + Q0 + '" width="' + (Q1 - Q0) + '" height="' + (Q1 - Q0) + '" rx="3" fill="none" stroke="var(--ink-2)" stroke-opacity=".55" stroke-width="2"/>';
        SEG8.forEach((sg, i) => { if (a.l & (1 << i)) s += '<path d="' + pathOf(sg, true) + '" stroke="' + ((o && o.elem && o.elem(i)) || colOf(o, 'l')) + '" stroke-width="4.4" stroke-linecap="round"/>'; });
        return s;
      },
      desc() { return null; }
    },
    ring1: {
      attrs: [mod('m', 'dot', 8), cat('c', 'middle shape', RINGC)],
      draw(a, o) { return ringDraw(a, o); },
      desc() { return null; }
    },
    ring2: {
      attrs: [mod('m', 'dot', 8), mod('q', 'square', 8), cat('c', 'middle shape', RINGC)],
      draw(a, o) { return ringDraw(a, o); },
      desc() { return null; }
    }
  };
  function ringDraw(a, o) {
    let s = slotGuides(range(0, 7).map(ringXY), 11.5);
    s += drawShape(a.c, 50, 50, 11, 0, 2, { col: colOf(o, 'c'), sw: 2.4 });
    if (a.q != null) { const p = ringXY(a.q); s += '<rect x="' + (p[0] - 11) + '" y="' + (p[1] - 11) + '" width="22" height="22" rx="2" fill="none" stroke="' + colOf(o, 'q') + '" stroke-width="3.2"/>'; }
    const p = ringXY(a.m);
    s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (a.q === a.m ? 6 : 8.5) + '" fill="' + colOf(o, 'm') + '"/>';
    return s;
  }
  V.LAY = LAY;

  // one figure as a complete little SVG (for answer choices and thumbnails)
  function figSVG(lay, a, o) { return svgWrap(LAY[lay].draw(a, o || {})); }

  // short captions of one attribute value (shown under the cells once solved)
  function capOf(at, v) {
    if (v == null) return '';
    if (at.t === 'set') return '';
    switch (at.k === 'o' || at.k === 'c' || at.k === 'g' ? 's' : at.k) {
      case 'f': return at.dom.length === 2 ? (v ? 'solid' : 'hollow') : FILLW[v];
      case 'z': return SIZEW[v];
      case 'a': case 'b': return ARROWS[v];
      case 'n': return String(v);
      case 'm': case 'q': return 'place ' + (v + 1);
      default: return String(v);
    }
  }
  // a value in words, for explanations
  function wordOf(at, v) {
    if (at.k === 'f') return at.dom.length === 2 ? (v ? 'solid' : 'hollow') : FILLW[v];
    if (at.k === 'z') return SIZEW[v];
    if (at.t === 'mod' && at.m === 8 && (at.k === 'a' || at.k === 'b')) return 'pointing ' + DIRW[v];
    if (at.k === 'm' || at.k === 'q') return 'place ' + (v + 1);
    if (at.k === 'g') return GLYPHW[v];
    return String(v);
  }

  /* ---------- rules: values, steps, operations ---------- */

  function inDom(at, z) {
    if (z === undefined || z === null || (typeof z === 'number' && isNaN(z))) return false;
    if (at.t === 'ord') return Number.isInteger(z) && z >= at.lo && z <= at.hi;
    if (at.t === 'mod') return Number.isInteger(z) && z >= 0 && z < at.m;
    if (at.t === 'set') return Number.isInteger(z) && z > 0 && z < (1 << at.bits);
    return at.dom.includes(z);
  }
  function stepV(at, v, d) {
    if (at.t === 'mod') return (((v + d) % at.m) + at.m) % at.m;
    const w = v + d;
    return w >= at.lo && w <= at.hi ? w : undefined;
  }
  // a turn in the smallest way round: -3 .. 4 for eight directions
  function turnOf(at, from, to) { let d = (((to - from) % at.m) + at.m) % at.m; if (d > at.m / 2) d -= at.m; return d; }
  function rotSet(at, m, times) {
    let r = m;
    const t = ((times % 4) + 4) % 4;
    for (let k = 0; k < t; k++) { let o = 0; for (let i = 0; i < at.bits; i++) if (r & (1 << i)) o |= 1 << at.perm[i]; r = o; }
    return r;
  }
  const OPS = {
    const: () => (x, y) => (x === y ? x : undefined),
    prog: (at, d) => (x, y) => (stepV(at, x, d) === y ? stepV(at, y, d) : undefined),
    add: (at) => (x, y) => (at.t === 'mod' ? (x + y) % at.m : x + y),
    sub: (at) => (x, y) => (at.t === 'mod' ? (((x - y) % at.m) + at.m) % at.m : x - y),
    rsub: (at) => (x, y) => (at.t === 'mod' ? (((y - x) % at.m) + at.m) % at.m : y - x),
    xor: () => (x, y) => x ^ y,
    or: () => (x, y) => x | y,
    and: () => (x, y) => x & y,
    diff: () => (x, y) => x & ~y,
    rdiff: () => (x, y) => y & ~x,
    rot: (at, d) => (x, y) => (rotSet(at, x, d) === y ? rotSet(at, y, d) : undefined)
  };
  // every rule shape the checker tries on a line of three
  function hypsOf(at) {
    const H = [['const']];
    if (at.t === 'ord') { const w = at.hi - at.lo; for (let d = -w; d <= w; d++) if (d) H.push(['prog', d]); H.push(['add'], ['sub'], ['rsub']); }
    if (at.t === 'mod') { for (let d = 1; d < at.m; d++) H.push(['prog', d]); H.push(['add'], ['sub'], ['rsub']); }
    if (at.t === 'set') H.push(['xor'], ['or'], ['and'], ['diff'], ['rdiff'], ['rot', 1], ['rot', 2], ['rot', 3]);
    return H;
  }

  function randVal(rng, at) {
    if (at.t === 'set') {
      const k = at.pmin + rng.int(at.pmax - at.pmin + 1);
      return rng.shuffle(range(0, at.bits - 1)).slice(0, k).reduce((m, i) => m | (1 << i), 0);
    }
    return rng.pick(at.dom);
  }
  function distinct(rng, at, n) {
    const out = [];
    for (let t = 0; t < 100 && out.length < n; t++) { const v = randVal(rng, at); if (!out.includes(v)) out.push(v); }
    return out.length === n ? out : null;
  }
  // 'prog 1 -1' -> { t: 'prog', d: ±1 };  'and diff' -> one of the two
  function pickRule(rng, spec) {
    if (!spec) return { t: 'const' };
    const parts = spec.split(' ');
    const types = parts.filter((w) => isNaN(+w)), ds = parts.filter((w) => !isNaN(+w)).map(Number);
    const r = { t: rng.pick(types) };
    if (['prog', 'rot', 'step', 'grow'].includes(r.t)) r.d = ds.length ? rng.pick(ds) : 1;
    return r;
  }
  const RCOL = ['var(--teal)', 'var(--pink)', 'var(--gold)', 'var(--purple)'];
  const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const andList = (a) => (a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
  const an = (w) => (/^[aeiou]/i.test(String(w)) ? 'an ' : 'a ') + w;
  // a value as a noun phrase: 'a triangle', 'triangles', 'solid', 'pointing up'
  function nounOf(at, v) {
    if (at.t === 'cat' && typeof v === 'string' && at.k !== 'g') return at.plural ? PLURAL[v] : an(v);
    return wordOf(at, v);
  }
  function oneWord(at, v) {
    if (at.t === 'set') return 'one pattern';
    if (at.k === 'f') return an(wordOf(at, v)) + ' one';
    if (at.k === 'z') return an(SIZEW[v]) + ' one';
    if (at.t === 'mod' && (at.k === 'a' || at.k === 'b')) return 'one pointing ' + DIRW[v];
    if (at.t === 'ord') return String(v);
    if (at.k === 'g') return 'a ' + GLYPHW[v];
    return (/^[aeiou]/.test(String(v)) ? 'an ' : 'a ') + v;
  }

  /* ---------- options: every candidate differs from the answer, balanced ----------
   * The options are a small cross product (2 × 2 × 2, 4 × 2, 3 × 2 …) of the
   * answer's values and tempting wrong ones, so no value gives the answer away
   * by turning up more often than the others. */

  function sigOf(lay, a) { return LAY[lay].attrs.map((at) => a[at.k]).join('|'); }
  function temptingVals(rng, at, v, ctx) {
    const c = [];
    const push = (z) => { if (inDom(at, z) && z !== v && !c.includes(z)) c.push(z); };
    if (at.t === 'ord') [v + 1, v - 1].concat(ctx, [v + 2, v - 2]).forEach(push);
    else if (at.t === 'mod') { ctx.forEach(push); [1, -1, 4, 2, -2, 3, -3].forEach((d) => push(stepV(at, v, d))); }
    else if (at.t === 'set') {
      const x = ctx[0], y = ctx[1];
      if (x != null && y != null) [x ^ y, x | y, x & y, x & ~y, y & ~x].forEach(push);
      ctx.forEach(push);
      [rotSet(at, v, 1), rotSet(at, v, 3), rotSet(at, v, 2)].forEach(push);
      for (let t = 0; t < 40; t++) push(v ^ (1 << rng.int(at.bits)));
    } else ctx.forEach(push);
    const head = rng.shuffle(c.slice(0, 4)), out = head.concat(c.slice(4));
    if (at.dom) rng.shuffle(at.dom.slice()).forEach((z) => { if (inDom(at, z) && z !== v && !out.includes(z)) out.push(z); });
    return out;
  }
  function buildOptions(rng, lay, ans, rules, n, ctxOf) {
    const A = LAY[lay].attrs.filter((at) => !at.fixed);
    const plans = n === 8 ? [[2, 2, 2], [4, 2], [8]] : n === 6 ? [[3, 2], [6]] : n === 5 ? [[5]] : [[2, 2], [4]];
    for (let attempt = 0; attempt < 12; attempt++) {
      const act = rng.shuffle(A.filter((at) => rules[at.k] && rules[at.k].t !== 'const'));
      const pas = rng.shuffle(A.filter((at) => !rules[at.k] || rules[at.k].t === 'const'));
      const L = act.concat(pas);
      for (const plan of plans) {
        if (plan.length > L.length) continue;
        const axes = [];
        let ok = true;
        for (let i = 0; i < plan.length && ok; i++) {
          const at = L[i], vals = [ans[at.k]];
          for (const z of temptingVals(rng, at, ans[at.k], ctxOf(at))) { if (vals.length >= plan[i]) break; vals.push(z); }
          if (vals.length < plan[i]) ok = false; else axes.push({ at, vals });
        }
        if (!ok) continue;
        let list = [Object.assign({}, ans)];
        axes.forEach(({ at, vals }) => { const nl = []; list.forEach((o) => vals.forEach((v) => nl.push(Object.assign({}, o, { [at.k]: v })))); list = nl; });
        rng.shuffle(list);
        const s = sigOf(lay, ans);
        return { list, ans: list.findIndex((o) => sigOf(lay, o) === s) };
      }
    }
    return null;
  }
  function checkValues(lay, figs) {
    for (const f of figs) for (const at of LAY[lay].attrs) if (!inDom(at, f[at.k])) return 'bad value ' + at.k + '=' + f[at.k];
    if (LAY[lay].fits && !figs.every(LAY[lay].fits)) return 'a figure does not fit its box';
    return null;
  }
  // the one option that has every predicted value
  function pickFitting(d, want) {
    const lay = LAY[d.lay];
    const sigs = d.opts.map((o) => sigOf(d.lay, o));
    if (uniq(sigs).length !== sigs.length) return { ok: false, err: 'two options are the same picture' };
    const fits = d.opts.map((o, i) => (lay.attrs.every((at) => o[at.k] === want[at.k]) ? i : -1)).filter((i) => i >= 0);
    if (fits.length !== 1) return { ok: false, err: fits.length + ' options fit the rules' };
    if (fits[0] !== d.ans) return { ok: false, err: 'the option that fits is ' + LETTERS[fits[0]] + ', not ' + LETTERS[d.ans] };
    return { ok: true };
  }
  // hints that name one rule at a time and cross out the options that break it
  function ruleHints(d, rows, intro) {
    const ans = d.opts[d.ans];
    const act = rows.filter((r) => r.rule.t !== 'const'), pas = rows.filter((r) => r.rule.t === 'const');
    const out = [{ text: intro(act.map((r) => 'the **' + r.at.name + '**')), out: [] }];
    act.forEach((r, i) => {
      const bad = d.opts.map((o, j) => (o[r.at.k] !== ans[r.at.k] ? j : -1)).filter((j) => j >= 0);
      out.push({ text: '**' + cap1(r.at.name) + ':** ' + r.txt + (bad.length ? ' I have crossed out the pictures that break this.' : ''), out: bad });
      if (i === act.length - 1 && pas.length) {
        const bad2 = d.opts.map((o, j) => (pas.some((p) => o[p.at.k] !== ans[p.at.k]) ? j : -1)).filter((j) => j >= 0);
        if (bad2.length) out.push({ text: 'And ' + andList(pas.map((p) => 'the ' + p.at.name)) + ' never change' + (pas.length === 1 ? 's' : '') + '. The pictures that forget it are crossed out too.', out: bad2 });
      }
    });
    return out;
  }

  /* ---------- matrices: a 3 × 3 grid, the last cell missing ---------- */

  // every value the missing cell could take, by any rule (along rows or down columns) that fits the eight shown
  function matrixPredict(at, g) {
    const out = new Map();
    const add = (z, why) => { if (!inDom(at, z)) return; if (!out.has(z)) out.set(z, []); out.get(z).push(why); };
    const views = {
      row: { full: [[g[0], g[1], g[2]], [g[3], g[4], g[5]]], part: [g[6], g[7]] },
      col: { full: [[g[0], g[3], g[6]], [g[1], g[4], g[7]]], part: [g[2], g[5]] }
    };
    for (const dir in views) {
      const L = views[dir];
      for (const h of hypsOf(at)) {
        const F = OPS[h[0]](at, h[1]);
        if (L.full.every((t) => { const z = F(t[0], t[1]); return z !== undefined && z === t[2]; })) add(F(L.part[0], L.part[1]), dir + ' ' + h.join(' '));
      }
      const s0 = uniq(L.full[0]), s1 = uniq(L.full[1]);
      if (s0.length === 3 && s1.length === 3 && s0.every((v) => s1.includes(v)) && L.part[0] !== L.part[1] && s0.includes(L.part[0]) && s0.includes(L.part[1])) {
        add(s0.find((v) => v !== L.part[0] && v !== L.part[1]), dir + ' dist');
      }
    }
    return out;
  }
  function matrixRuleHolds(at, rule, g) {
    const rows = [0, 3, 6].map((i) => [g[i], g[i + 1], g[i + 2]]);
    const cols = [0, 1, 2].map((i) => [g[i], g[i + 3], g[i + 6]]);
    if (rule.t === 'const') return g.every((v) => v === g[0]);
    if (rule.t === 'row') return rows.every((r) => r[0] === r[1] && r[1] === r[2]);
    if (rule.t === 'col') return cols.every((r) => r[0] === r[1] && r[1] === r[2]);
    if (rule.t === 'dist') { const s = uniq(rows[0]); return s.length === 3 && rows.every((r) => uniq(r).length === 3 && r.every((v) => s.includes(v))); }
    const F = OPS[rule.t] && OPS[rule.t](at, rule.d);
    return !!F && rows.every((r) => { const z = F(r[0], r[1]); return z !== undefined && z === r[2]; });
  }
  function genMatrixAttr(rng, at, rule) {
    const g = new Array(9);
    const put = (r, v) => { g[r * 3] = v[0]; g[r * 3 + 1] = v[1]; g[r * 3 + 2] = v[2]; };
    switch (rule.t) {
      case 'const': g.fill(randVal(rng, at)); return g;
      case 'row': { const X = distinct(rng, at, 3); if (!X) return null; for (let r = 0; r < 3; r++) put(r, [X[r], X[r], X[r]]); return g; }
      case 'col': { const X = distinct(rng, at, 3); if (!X) return null; for (let r = 0; r < 3; r++) put(r, X); return g; }
      case 'dist': { const X = distinct(rng, at, 3); if (!X) return null; const sh = rng() < .5 ? 1 : 2; for (let r = 0; r < 3; r++) put(r, [0, 1, 2].map((j) => X[(j + r * sh) % 3])); return g; }
      case 'prog': {
        const d = rule.d, same = rng() < .3, starts = [];
        for (let r = 0; r < 3; r++) {
          let s;
          for (let t = 0; t < 60; t++) {
            const c = same && starts.length ? starts[0] : rng.pick(at.dom);
            if (stepV(at, c, d) !== undefined && stepV(at, c, 2 * d) !== undefined && (same || !starts.includes(c))) { s = c; break; }
          }
          if (s === undefined) return null;
          starts.push(s);
          put(r, [s, stepV(at, s, d), stepV(at, s, 2 * d)]);
        }
        return g;
      }
      case 'add': case 'sub': {
        const seen = [];
        for (let r = 0; r < 3; r++) {
          let ok = false;
          for (let t = 0; t < 80 && !ok; t++) {
            let x, y, z;
            if (rule.t === 'add') { x = rng.range(at.lo, at.hi); y = rng.range(at.lo, at.hi); z = x + y; }
            else { z = rng.range(at.lo, at.hi); y = rng.range(at.lo, at.hi); x = z + y; }
            if (!inDom(at, x) || !inDom(at, y) || !inDom(at, z) || seen.includes(x + ',' + y)) continue;
            seen.push(x + ',' + y); put(r, [x, y, z]); ok = true;
          }
          if (!ok) return null;
        }
        return g;
      }
      case 'xor': case 'or': case 'and': case 'diff': {
        const F = OPS[rule.t](at);
        for (let r = 0; r < 3; r++) {
          let ok = false;
          for (let t = 0; t < 150 && !ok; t++) {
            const x = randVal(rng, at), y = randVal(rng, at);
            if (x === y || (x & y) === 0) continue;
            const z = F(x, y);
            if (!inDom(at, z) || z === x || z === y || popcount(z) > at.pmax + 2) continue;
            if ((rule.t === 'or' || rule.t === 'xor') && ((x & ~y) === 0 || (y & ~x) === 0)) continue;
            put(r, [x, y, z]); ok = true;
          }
          if (!ok) return null;
        }
        return g;
      }
      case 'rot': {
        for (let r = 0; r < 3; r++) {
          let ok = false;
          for (let t = 0; t < 80 && !ok; t++) {
            const x = randVal(rng, at), y = rotSet(at, x, rule.d), z = rotSet(at, y, rule.d);
            if (y === x || z === x || z === y) continue;
            put(r, [x, y, z]); ok = true;
          }
          if (!ok) return null;
        }
        return g;
      }
    }
    return null;
  }
  function matrixRuleText(at, rule, g) {
    const W = (v) => wordOf(at, v);
    switch (rule.t) {
      case 'const': return at.t === 'set' ? 'the same in every picture.' : 'never changes: always ' + nounOf(at, g[0]) + '.';
      case 'row': return 'stays the same all along each row: ' + nounOf(at, g[0]) + ' in the top row, ' + nounOf(at, g[3]) + ' in the middle row, ' + nounOf(at, g[6]) + ' in the bottom row.';
      case 'col': return 'stays the same all down each column: ' + nounOf(at, g[0]) + ' on the left, ' + nounOf(at, g[1]) + ' in the middle, ' + nounOf(at, g[2]) + ' on the right.';
      case 'dist': return 'every row has ' + andList(uniq([g[0], g[1], g[2]]).map((v) => oneWord(at, v))) + ', each once, in a different order.';
      case 'prog':
        if (at.t === 'mod') return 'turns ' + Math.abs(rule.d) * 45 + '° ' + (rule.d > 0 ? 'clockwise' : 'anticlockwise') + ' from each picture to the next along a row.';
        if (at.k === 'z') return (rule.d > 0 ? 'grows' : 'shrinks') + ' by one size at each step along a row.';
        return 'goes ' + (rule.d > 0 ? 'up' : 'down') + ' by ' + Math.abs(rule.d) + ' at each step along a row (' + g[0] + ' → ' + g[1] + ' → ' + g[2] + ' in the top row).';
      case 'add': return 'in each row the first two add up to the third (' + g[0] + ' + ' + g[1] + ' = ' + g[2] + ' in the top row).';
      case 'sub': return 'in each row, take the second from the first and you get the third (' + g[0] + ' − ' + g[1] + ' = ' + g[2] + ' in the top row).';
      case 'xor': return 'the third picture keeps the ' + at.items + ' that are in only one of the first two; where both have one, the two cancel out.';
      case 'or': return 'the third picture puts the first two together: every ' + at.item + ' from either of them.';
      case 'and': return 'the third picture keeps only the ' + at.items + ' that the first two have in common.';
      case 'diff': return 'the third picture is the first one with the second one\'s ' + at.items + ' taken away.';
      case 'rot': return 'the pattern turns a quarter turn ' + (rule.d === 3 ? 'anticlockwise' : 'clockwise') + ' at each step along a row.';
    }
    return '';
  }
  function matrixRows(d) {
    const lay = LAY[d.lay], g9 = d.grid.concat([d.opts[d.ans]]);
    return lay.attrs.filter((at) => !at.fixed).map((at) => ({ at, rule: d.rules[at.k], txt: matrixRuleText(at, d.rules[at.k], g9.map((c) => c[at.k])) }));
  }
  function explainRows(rows) {
    let ci = 0;
    const act = rows.filter((r) => r.rule.t !== 'const').map((r) => '• <b style="color:' + RCOL[ci++ % RCOL.length] + '">' + cap1(r.at.name) + ':</b> ' + r.txt);
    const pas = rows.filter((r) => r.rule.t === 'const').map((r) => '• **' + cap1(r.at.name) + '** ' + r.txt);
    return act.concat(pas).join('\n');
  }
  function explainMatrix(d) {
    const desc = LAY[d.lay].desc(d.opts[d.ans]);
    return 'Every row follows the same rules:\n' + explainRows(matrixRows(d)) + '\n\nSo the missing picture is **' + LETTERS[d.ans] + '**' + (desc ? ': ' + desc + '.' : '.');
  }
  function verifyMatrix(d) {
    const lay = LAY[d.lay];
    if (!lay) return { ok: false, err: 'unknown layout ' + d.lay };
    if (!Array.isArray(d.grid) || d.grid.length !== 8) return { ok: false, err: 'the grid must hold the eight shown figures' };
    if (!Array.isArray(d.opts) || d.opts.length < 4 || !(d.ans >= 0 && d.ans < d.opts.length)) return { ok: false, err: 'bad options' };
    const bad = checkValues(d.lay, d.grid.concat(d.opts));
    if (bad) return { ok: false, err: bad };
    const want = {};
    for (const at of lay.attrs) {
      const pr = matrixPredict(at, d.grid.map((c) => c[at.k]));
      if (pr.size !== 1) return { ok: false, err: at.name + ': ' + (pr.size ? 'more than one reading (' + Array.from(pr.keys()).join(', ') + ')' : 'no rule fits') };
      want[at.k] = pr.keys().next().value;
      const rule = d.rules && d.rules[at.k];
      if (!rule || !matrixRuleHolds(at, rule, d.grid.map((c) => c[at.k]).concat([want[at.k]]))) return { ok: false, err: at.name + ': the stated rule does not hold' };
    }
    return pickFitting(d, want);
  }
  const MREC = {
    1: [
      { lay: 'many', r: { n: 'prog 1' } }, { lay: 'many', r: { n: 'prog -1' } }, { lay: 'one', r: { s: 'row' } },
      { lay: 'one', r: { z: 'prog 1 -1' } }, { lay: 'poly', r: { n: 'prog 1' } }, { lay: 'glyph', r: { a: 'prog 2 -2' } },
      { lay: 'one', r: { f: 'col' } }, { lay: 'dotsin', r: { n: 'prog 1' } }, { lay: 'nest', r: { s: 'row' } }, { lay: 'clock', r: { a: 'prog 2 -2' } }
    ],
    2: [
      { lay: 'many', r: { n: 'prog 1 -1', s: 'row' } }, { lay: 'one', r: { s: 'dist', f: 'row' } }, { lay: 'one', r: { s: 'dist', z: 'col' } },
      { lay: 'glyph', r: { a: 'prog 1 -1', f: 'row' } }, { lay: 'nest', r: { o: 'dist', s: 'row' } }, { lay: 'lines', r: { l: 'or' } },
      { lay: 'grid', r: { p: 'rot 1 3' } }, { lay: 'clock', r: { a: 'prog 1 -1 3', b: 'row' } }, { lay: 'poly', r: { n: 'prog 1 -1', f: 'dist' } },
      { lay: 'dotsin', r: { n: 'prog 1 2', o: 'dist' } }
    ],
    3: [
      { lay: 'many', r: { n: 'add', s: 'dist' } }, { lay: 'lines', r: { l: 'xor' } }, { lay: 'one', r: { s: 'dist', f: 'dist' } },
      { lay: 'nest', r: { o: 'dist', s: 'dist' } }, { lay: 'clock', r: { a: 'prog 1 2 -1', b: 'prog -1 -2 3' } }, { lay: 'grid', r: { p: 'xor' } },
      { lay: 'grid', r: { p: 'or', s: 'dist' } }, { lay: 'glyph', r: { a: 'prog 1 3 -1 -3', f: 'dist' } }, { lay: 'dotsin', r: { n: 'add', o: 'dist' } },
      { lay: 'poly', r: { n: 'prog 1 2 -1', f: 'dist', z: 'row' } }
    ],
    4: [
      { lay: 'many', r: { n: 'prog 2 -2 1', s: 'dist', f: 'dist' } }, { lay: 'many', r: { n: 'sub', s: 'dist' } }, { lay: 'nest', r: { o: 'dist', s: 'dist', f: 'dist' } },
      { lay: 'grid', r: { p: 'and diff', s: 'dist' } }, { lay: 'lines', r: { l: 'and diff' } }, { lay: 'glyph', r: { a: 'prog 1 3 -1 -3', f: 'dist', z: 'dist' } },
      { lay: 'one', r: { s: 'dist', z: 'dist', f: 'dist' } }, { lay: 'clock', r: { a: 'dist', b: 'prog 1 -1 3' } }, { lay: 'dotsin', r: { n: 'sub', o: 'dist' } }
    ],
    5: [
      { lay: 'many', r: { n: 'sub add', s: 'dist', f: 'dist' } }, { lay: 'grid', r: { p: 'xor', s: 'dist', f: 'dist' } }, { lay: 'grid', r: { p: 'rot 1 3', s: 'dist', f: 'dist' } },
      { lay: 'lines', r: { l: 'xor diff and' } }, { lay: 'glyph', r: { a: 'prog 3 -3', f: 'dist', z: 'prog 1 -1' } }, { lay: 'clock', r: { a: 'prog 3 -3', b: 'dist' } },
      { lay: 'dotsin', r: { n: 'add sub', o: 'dist' } }, { lay: 'grid', r: { p: 'diff and', s: 'dist', f: 'dist' } }
    ]
  };
  const MOPTS = [0, 6, 6, 8, 8, 8];
  function genMatrix(rng, level, recipe) {
    for (let tries = 0; tries < 80; tries++) {
      const rec = recipe || rng.pick(MREC[level]);
      const lay = LAY[rec.lay];
      const g9 = range(0, 8).map(() => ({}));
      const rules = {};
      let ok = true;
      for (const at of lay.attrs) {
        const rule = pickRule(rng, rec.r[at.k]);
        const vals = genMatrixAttr(rng, at, rule);
        if (!vals) { ok = false; break; }
        rules[at.k] = rule;
        vals.forEach((v, i) => { g9[i][at.k] = v; });
      }
      if (!ok || (lay.fits && !g9.every(lay.fits))) continue;
      const ans = g9[8], grid = g9.slice(0, 8);
      const ctxOf = (at) => [grid[6][at.k], grid[7][at.k], grid[5][at.k], grid[2][at.k], grid[4][at.k]].concat(grid.map((c) => c[at.k]));
      const op = buildOptions(rng, rec.lay, ans, rules, rec.n || MOPTS[level], ctxOf);
      if (!op) continue;
      const d = { kind: 'matrix', lay: rec.lay, grid, rules, opts: op.list, ans: op.ans };
      if (verifyMatrix(d).ok) return d;
    }
    return null;
  }

  /* ---------- sequences: what comes next? ---------- */

  function genSeqAttr(rng, at, rule, k) {
    const n = k + 1, v = [];
    switch (rule.t) {
      case 'const': { const x = randVal(rng, at); for (let i = 0; i < n; i++) v.push(x); return v; }
      case 'alt': { const X = distinct(rng, at, 2); if (!X) return null; for (let i = 0; i < n; i++) v.push(X[i % 2]); return v; }
      case 'cyc3': { const X = distinct(rng, at, 3); if (!X) return null; for (let i = 0; i < n; i++) v.push(X[i % 3]); return v; }
      case 'step': case 'grow': {
        for (let t = 0; t < 60; t++) {
          const w = [rng.pick(at.dom)];
          for (let i = 1; i < n; i++) w.push(stepV(at, w[i - 1], rule.t === 'step' ? rule.d : Math.sign(rule.d) * (Math.abs(rule.d) + i - 1)));
          if (w.every((x) => x !== undefined)) return w;
        }
        return null;
      }
      case 'rot': {
        for (let t = 0; t < 80; t++) {
          const w = [randVal(rng, at)];
          for (let i = 1; i < n; i++) w.push(rotSet(at, w[i - 1], rule.d));
          if (uniq(w.slice(0, 4)).length === Math.min(4, n)) return w;
        }
        return null;
      }
    }
    return null;
  }
  function seqRuleHolds(at, rule, v) {
    switch (rule.t) {
      case 'const': return v.every((x) => x === v[0]);
      case 'alt': return v[0] !== v[1] && v.every((x, i) => i < 2 || x === v[i - 2]);
      case 'cyc3': return uniq(v.slice(0, 3)).length === 3 && v.every((x, i) => i < 3 || x === v[i - 3]);
      case 'step': return v.every((x, i) => i === 0 || stepV(at, v[i - 1], rule.d) === x);
      case 'grow': return v.every((x, i) => i === 0 || stepV(at, v[i - 1], Math.sign(rule.d) * (Math.abs(rule.d) + i - 1)) === x);
      case 'rot': return v.every((x, i) => i === 0 || rotSet(at, v[i - 1], rule.d) === x);
    }
    return false;
  }
  // every value the next figure could take, by any rule that fits the ones shown
  function seqPredict(at, v) {
    const out = new Map(), k = v.length, last = v[k - 1];
    const add = (z, why) => { if (!inDom(at, z)) return; if (!out.has(z)) out.set(z, []); out.get(z).push(why); };
    if (v.every((x) => x === v[0])) add(v[0], 'const');
    if (at.t === 'ord' || at.t === 'mod') {
      const w = at.t === 'mod' ? at.m - 1 : at.hi - at.lo;
      for (let d = -w; d <= w; d++) {
        if (!d) continue;
        let ok = true;
        for (let i = 1; i < k && ok; i++) ok = stepV(at, v[i - 1], d) === v[i];
        if (ok) add(stepV(at, last, d), 'step ' + d);
      }
      if (k >= 4) {
        const df = [];
        for (let i = 1; i < k; i++) df.push(at.t === 'mod' ? turnOf(at, v[i - 1], v[i]) : v[i] - v[i - 1]);
        const e = df[1] - df[0];
        if (e !== 0 && df.every((x, i) => i === 0 || x - df[i - 1] === e)) add(at.t === 'mod' ? stepV(at, last, df[df.length - 1] + e) : last + df[df.length - 1] + e, 'grow');
      }
    }
    if (k >= 3 && v[0] !== v[1] && v.every((x, i) => i < 2 || x === v[i - 2])) add(v[k - 2], 'alt');
    if (k >= 4 && uniq(v.slice(0, 3)).length === 3 && v.every((x, i) => i < 3 || x === v[i - 3])) add(v[k - 3], 'cyc3');
    if (k >= 5 && uniq(v.slice(0, 4)).length === 4 && v.every((x, i) => i < 4 || x === v[i - 4])) add(v[k - 4], 'cyc4');
    if (at.t === 'set') {
      for (const d of [1, 2, 3]) {
        let ok = true;
        for (let i = 1; i < k && ok; i++) ok = rotSet(at, v[i - 1], d) === v[i];
        if (ok) add(rotSet(at, last, d), 'rot ' + d);
      }
      if (k >= 3 && v.every((x, i) => i < 2 || x === (v[i - 1] ^ v[i - 2]))) add(v[k - 1] ^ v[k - 2], 'xor');
    }
    return out;
  }
  function seqRuleText(at, rule, v) {
    const W = (x) => wordOf(at, x);
    const ring = at.k === 'm' || at.k === 'q';
    switch (rule.t) {
      case 'const': return at.t === 'set' ? 'the same in every picture.' : 'never changes: always ' + nounOf(at, v[0]) + '.';
      case 'alt': return 'takes turns: ' + W(v[0]) + ', ' + W(v[1]) + ', ' + W(v[0]) + ', ' + W(v[1]) + '…';
      case 'cyc3': return 'goes round ' + W(v[0]) + ', ' + W(v[1]) + ', ' + W(v[2]) + ' and then starts again.';
      case 'step':
        if (ring) return 'moves ' + NUMW[Math.abs(rule.d)] + ' place' + (Math.abs(rule.d) > 1 ? 's' : '') + ' ' + (rule.d > 0 ? 'clockwise' : 'anticlockwise') + ' round the edge each time.';
        if (at.t === 'mod') return 'turns ' + Math.abs(rule.d) * 45 + '° ' + (rule.d > 0 ? 'clockwise' : 'anticlockwise') + ' each time.';
        if (at.k === 'n' && at.lo === 3) return (rule.d > 0 ? 'one more side' : 'one side fewer') + ' each time (' + v[0] + ', ' + v[1] + ', ' + v[2] + '…).';
        return 'goes ' + (rule.d > 0 ? 'up' : 'down') + ' by ' + Math.abs(rule.d) + ' each time (' + v[0] + ', ' + v[1] + ', ' + v[2] + '…).';
      case 'grow': {
        const s = Math.abs(rule.d), dir = rule.d > 0 ? 'clockwise' : 'anticlockwise';
        if (ring) return 'moves further each time, ' + dir + ': ' + NUMW[s] + ' place, then ' + NUMW[s + 1] + ', then ' + NUMW[s + 2] + '…';
        return 'turns a little further each time, ' + dir + ': ' + s * 45 + '°, then ' + (s + 1) * 45 + '°, then ' + (s + 2) * 45 + '°…';
      }
      case 'rot': return 'the pattern turns a quarter turn ' + (rule.d === 3 ? 'anticlockwise' : 'clockwise') + ' each time.';
    }
    return '';
  }
  function seqRows(d) {
    const lay = LAY[d.lay], all = d.seq.concat([d.opts[d.ans]]);
    return lay.attrs.filter((at) => !at.fixed).map((at) => ({ at, rule: d.rules[at.k], txt: seqRuleText(at, d.rules[at.k], all.map((c) => c[at.k])) }));
  }
  function explainNext(d) {
    const desc = LAY[d.lay].desc(d.opts[d.ans]);
    return 'Follow each part of the picture on its own:\n' + explainRows(seqRows(d)) + '\n\nSo the next picture is **' + LETTERS[d.ans] + '**' + (desc ? ': ' + desc + '.' : '.');
  }
  // a short caption of one value in the sequence, for the picture it sits under
  function seqCap(at, vals, i) {
    if (at.t === 'set') return '';
    if (at.k === 'm' || at.k === 'q') { if (!i) return 'start'; const t = turnOf(at, vals[i - 1], vals[i]); return (t > 0 ? '+' : '−') + Math.abs(t); }
    return capOf(at, vals[i]);
  }
  function verifyNext(d) {
    const lay = LAY[d.lay];
    if (!lay) return { ok: false, err: 'unknown layout ' + d.lay };
    if (!Array.isArray(d.seq) || d.seq.length < 3) return { ok: false, err: 'the sequence is too short' };
    if (!Array.isArray(d.opts) || d.opts.length < 4 || !(d.ans >= 0 && d.ans < d.opts.length)) return { ok: false, err: 'bad options' };
    const bad = checkValues(d.lay, d.seq.concat(d.opts));
    if (bad) return { ok: false, err: bad };
    const want = {};
    for (const at of lay.attrs) {
      const vals = d.seq.map((c) => c[at.k]);
      const pr = seqPredict(at, vals);
      if (pr.size !== 1) return { ok: false, err: at.name + ': ' + (pr.size ? 'more than one reading (' + Array.from(pr.keys()).join(', ') + ')' : 'no rule fits') };
      want[at.k] = pr.keys().next().value;
      const rule = d.rules && d.rules[at.k];
      if (!rule || !seqRuleHolds(at, rule, vals.concat([want[at.k]]))) return { ok: false, err: at.name + ': the stated rule does not hold' };
    }
    return pickFitting(d, want);
  }
  const NREC = {
    1: [
      { lay: 'glyph', r: { a: 'step 2 -2' } }, { lay: 'many', r: { n: 'step 1' } }, { lay: 'poly', r: { n: 'step 1' } }, { lay: 'one', r: { s: 'alt' } },
      { lay: 'ring1', r: { m: 'step 1 -1' } }, { lay: 'one', r: { f: 'alt' } }, { lay: 'clock', r: { a: 'step 2 -2' } }, { lay: 'many', r: { n: 'step -1' } }
    ],
    2: [
      { lay: 'glyph', r: { a: 'step 1 -1', f: 'alt' } }, { lay: 'many', r: { n: 'step 1 -1', f: 'alt' } }, { lay: 'ring1', r: { m: 'step 2 -2 3', c: 'alt' } },
      { lay: 'clock', r: { a: 'step 1 -1 3' } }, { lay: 'poly', r: { n: 'step 1 -1', f: 'alt' } }, { lay: 'lines', r: { l: 'rot 1 3' } }, { lay: 'one', r: { s: 'cyc3' } }
    ],
    3: [
      { lay: 'ring2', r: { m: 'step 1 -1', q: 'step 2 -2 3 -3' } }, { lay: 'glyph', r: { a: 'step 1 3 -1 -3', f: 'cyc3' } }, { lay: 'many', r: { n: 'step 1 -1', s: 'cyc3' } },
      { lay: 'clock', r: { a: 'step 1 -1', b: 'step 2 3 -2 -3' } }, { lay: 'one', r: { s: 'cyc3', f: 'alt' } }, { lay: 'grid', r: { p: 'rot 1 3', f: 'alt' } },
      { lay: 'poly', r: { n: 'step 1 -1', f: 'cyc3' } }
    ],
    4: [
      { lay: 'glyph', k: 4, r: { a: 'grow 1 -1', f: 'alt' } }, { lay: 'ring2', r: { m: 'step 1 -1 2', q: 'step 3 -3', c: 'alt' } }, { lay: 'clock', k: 4, r: { a: 'grow 1 -1', b: 'step 1 -1' } },
      { lay: 'many', r: { n: 'step 1 -1', s: 'cyc3', f: 'alt' } }, { lay: 'grid', r: { p: 'rot 1 3', s: 'cyc3' } }, { lay: 'one', r: { s: 'cyc3', z: 'alt', f: 'cyc3' } }
    ],
    5: [
      { lay: 'glyph', k: 4, r: { a: 'grow 1 -1', f: 'cyc3', z: 'alt' } }, { lay: 'ring2', k: 4, r: { m: 'grow 1 -1', q: 'step 3 -3 2', c: 'cyc3' } },
      { lay: 'clock', k: 4, r: { a: 'grow 1 -1', b: 'grow 1 -1' } }, { lay: 'many', r: { n: 'step 1 -1', s: 'cyc3', f: 'cyc3' } },
      { lay: 'grid', r: { p: 'rot 1 3', s: 'cyc3', f: 'alt' } }, { lay: 'poly', r: { n: 'step 1 -1', f: 'cyc3', z: 'alt' } }
    ]
  };
  const NFRAMES = [0, 4, 4, 5, 5, 5], NOPTS = [0, 4, 6, 6, 8, 8];
  function genNext(rng, level, recipe) {
    for (let tries = 0; tries < 80; tries++) {
      const rec = recipe || rng.pick(NREC[level]);
      const lay = LAY[rec.lay], k = rec.k || NFRAMES[level];
      const frames = range(0, k).map(() => ({}));
      const rules = {};
      let ok = true;
      for (const at of lay.attrs) {
        const rule = pickRule(rng, rec.r[at.k]);
        const vals = genSeqAttr(rng, at, rule, k);
        if (!vals) { ok = false; break; }
        rules[at.k] = rule;
        vals.forEach((v, i) => { frames[i][at.k] = v; });
      }
      if (!ok || (lay.fits && !frames.every(lay.fits))) continue;
      const ans = frames[k], seq = frames.slice(0, k);
      const ctxOf = (at) => [seq[k - 1][at.k], seq[k - 2][at.k], seq[k - 3][at.k]].concat(seq.map((c) => c[at.k]));
      const op = buildOptions(rng, rec.lay, ans, rules, rec.n || NOPTS[level], ctxOf);
      if (!op) continue;
      const d = { kind: 'next', lay: rec.lay, seq, rules, opts: op.list, ans: op.ans };
      if (verifyNext(d).ok) return d;
    }
    return null;
  }

  /* ---------- odd one out ----------
   * One property (the key) holds for all figures but one. The check computes
   * every property a solver might notice and refuses a puzzle where any of them
   * singles out a different figure. */

  const OCOL = ['var(--accent)', 'var(--teal)', 'var(--pink)', 'var(--gold)', 'var(--purple)', 'var(--green)'];
  const r2 = (v) => Math.round(v * 100) / 100;
  function normUnit(pts) {
    const b = boxCentre(pts);
    const m = Math.max(...b.map((p) => Math.max(Math.abs(p[0]), Math.abs(p[1]))));
    return b.map(([x, y]) => [r2(x / m), r2(y / m)]);
  }
  function simplePoly(p) {
    const n = p.length;
    const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const hit = (a, b, c, d) => cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0;
    for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue;
      if (hit(p[i], p[(i + 1) % n], p[j], p[(j + 1) % n])) return false;
    }
    return true;
  }
  // how far a polygon is from having a mirror line (0: it has one), and the best line through the area centroid
  function mirrorAxis(poly) {
    const c = centroidOf(poly);
    let best = Infinity, bestDeg = 0;
    for (let deg = 0; deg < 180; deg += .5) {
      const ux = Math.cos(deg * RAD), uy = Math.sin(deg * RAD);
      let worst = 0;
      for (const p of poly) {
        const dx = p[0] - c[0], dy = p[1] - c[1], t = dx * ux + dy * uy;
        const rx = c[0] + 2 * t * ux - dx, ry = c[1] + 2 * t * uy - dy;
        let m = Infinity;
        for (const q of poly) m = Math.min(m, Math.hypot(q[0] - rx, q[1] - ry));
        worst = Math.max(worst, m);
        if (worst >= best) break;
      }
      if (worst < best) { best = worst; bestDeg = deg; }
    }
    return { score: best, deg: bestDeg, c };
  }
  const mirrorScore = (poly) => mirrorAxis(poly).score;

  const NAMED = {
    3: [regular(3, 1, -90), [[-1, .7], [1, .7], [-1, -.8]], [[0, -1], [.5, .95], [-.5, .95]], [[-1, .6], [.95, .85], [.25, -.9]], [[-1, .45], [1, .45], [-.45, -.35]]],
    4: [[[-1, -1], [1, -1], [1, 1], [-1, 1]], [[-1, -.55], [1, -.55], [1, .55], [-1, .55]], [[0, -1], [.62, 0], [0, 1], [-.62, 0]], [[-.55, -.6], [1, -.6], [.55, .6], [-1, .6]],
      [[0, -1], [.62, -.3], [0, 1], [-.62, -.3]], [[-.5, -.6], [.5, -.6], [1, .6], [-1, .6]], [[-.8, -.75], [.9, -.4], [.55, .85], [-.9, .5]]],
    5: [regular(5, 1, -90), [[-.8, -.1], [0, -.95], [.8, -.1], [.8, .9], [-.8, .9]], [[-.95, -.2], [-.2, -.95], [.85, -.5], [.7, .75], [-.6, .85]], [[-1, -.5], [.3, -.9], [1, .2], [0, .9], [-.8, .6]]],
    6: [regular(6, 1, 0), [[-.8, -.9], [-.1, -.9], [-.1, .2], [.8, .2], [.8, .9], [-.8, .9]], [[-1, 0], [-.5, -.7], [.5, -.7], [1, 0], [.5, .7], [-.5, .7]], [[-1, -.6], [0, -.6], [.6, 0], [0, .6], [-1, .6], [-.4, 0]]]
  };
  function irregular(rng, n, concave) {
    for (let t = 0; t < 300; t++) {
      const base = rng() * 360, step = 360 / n, pts = [];
      for (let i = 0; i < n; i++) {
        const a = (base + i * step + (rng() - .5) * step * .5) * RAD;
        const r = concave ? .42 + rng() * .58 : .8 + rng() * .2;
        pts.push([r * Math.cos(a), r * Math.sin(a)]);
      }
      const q = cornerQuality(pts);
      if (q.turn < 22 || q.side < .3 || (!concave && !isConvex(pts))) continue;
      return pts;
    }
    return null;
  }
  function symPoly(rng, m, noBottom) {
    for (let t = 0; t < 300; t++) {
      const angs = [];
      for (let i = 0; i < m; i++) angs.push(-70 + rng() * 140);
      angs.sort((a, b) => a - b);
      if (angs.some((a, i) => i && a - angs[i - 1] < 24)) continue;
      const right = angs.map((a) => { const r = .42 + rng() * .58; return [r * Math.cos(a * RAD), r * Math.sin(a * RAD)]; });
      const pts = [[0, -(.5 + rng() * .5)]].concat(right, noBottom ? [] : [[0, .5 + rng() * .5]], right.slice().reverse().map(([x, y]) => [-x, y]));
      const q = cornerQuality(pts);
      if (q.turn < 18 || q.side < .25) continue;
      return pts;
    }
    return null;
  }
  function breakSym(rng, pts, m) {
    for (let t = 0; t < 120; t++) {
      const j = 1 + rng.int(m), p = pts[j];
      let r = Math.hypot(p[0], p[1]), a = Math.atan2(p[1], p[0]);
      if (rng() < .6) r *= rng() < .5 ? .62 : 1.45; else a += (rng() < .5 ? -1 : 1) * 20 * RAD;
      if (r > 1.05 || r < .3) continue;
      const q = pts.slice();
      q[j] = [r * Math.cos(a), r * Math.sin(a)];
      const cq = cornerQuality(q);
      if (cq.turn < 18 || cq.side < .25 || !simplePoly(q) || mirrorScore(normUnit(q)) < .14) continue;
      return q;
    }
    return null;
  }
  function gridFeat(n, on) {
    const S = new Set(on), count = on.length;
    const seen = new Set([on[0]]), st = [on[0]];
    while (st.length) {
      const c = st.pop(), r = Math.floor(c / n), k = c % n;
      [[r - 1, k], [r + 1, k], [r, k - 1], [r, k + 1]].forEach(([a, b]) => {
        const id = a * n + b;
        if (a >= 0 && a < n && b >= 0 && b < n && S.has(id) && !seen.has(id)) { seen.add(id); st.push(id); }
      });
    }
    const tf = [(r, c) => [r, n - 1 - c], (r, c) => [n - 1 - r, c], (r, c) => [c, r], (r, c) => [n - 1 - c, n - 1 - r], (r, c) => [n - 1 - r, n - 1 - c], (r, c) => [c, n - 1 - r]];
    const sym = tf.some((f) => on.every((id) => { const [a, b] = f(Math.floor(id / n), id % n); return S.has(a * n + b); }));
    let full = false;
    for (let i = 0; i < n; i++) {
      let row = true, col = true;
      for (let j = 0; j < n; j++) { if (!S.has(i * n + j)) row = false; if (!S.has(j * n + i)) col = false; }
      if (row || col) full = true;
    }
    return { count, odd: count % 2 === 1, connected: seen.size === count, sym, full, centre: n % 2 ? S.has((n * n - 1) / 2) : false };
  }
  function pieFeat(s, on) {
    const S = new Set(on);
    let runs = 0;
    for (let i = 0; i < s; i++) if (S.has(i) && !S.has((i + s - 1) % s)) runs++;
    let sym = false;
    for (let a = 0; a < s && !sym; a++) sym = on.every((i) => S.has(((a - i) % s + s) % s));
    return { count: on.length, odd: on.length % 2 === 1, joined: runs <= 1, sym };
  }
  const POLYO = {
    L4: [[0, 0], [0, 1], [0, 2], [1, 2]], S4: [[1, 0], [2, 0], [0, 1], [1, 1]],
    F5: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], P5: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]], N5: [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3]],
    Y5: [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]], L5: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]], R6: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2], [2, 2]]
  };
  function cellsCanon(cells) {
    let best = null, cur = cells;
    for (let r = 0; r < 4; r++) {
      cur = cur.map(([x, y]) => [-y, x]);
      const mx = Math.min(...cur.map((p) => p[0])), my = Math.min(...cur.map((p) => p[1]));
      const key = cur.map(([x, y]) => (x - mx) + ',' + (y - my)).sort().join(';');
      if (best === null || key < best) best = key;
    }
    return best;
  }
  function figCells(f) {
    let c = POLYO[f.b].map(([x, y]) => [f.m ? -x : x, y]);
    for (let i = 0; i < f.k; i++) c = c.map(([x, y]) => [-y, x]);
    return c;
  }
  const OKEY = { same: 'same', sides: 'sides', sidepar: 'even', sym: 'sym', count: 'count', parity: 'odd', pie: 'count', chiral: 'hand', dotsides: 'match' };
  function oddFeatures(type, f) {
    switch (type) {
      case 'same': return { same: f.o === f.s, outer: f.o, inner: f.s, fill: f.f };
      case 'sides': case 'sidepar': case 'sym': { const n = f.pts.length; return { sides: n, even: n % 2 === 0, convex: isConvex(f.pts), sym: mirrorScore(f.pts) < .04 }; }
      case 'count': case 'parity': return gridFeat(f.n, f.on);
      case 'pie': return pieFeat(f.s, f.on);
      case 'chiral': return { hand: cellsCanon(figCells(f)) === cellsCanon(POLYO[f.b]) ? 'turned' : 'flipped', turn: f.k };
      case 'dotsides': return { match: f.m === f.n, sides: f.n, dots: f.m, sidesOdd: f.n % 2, dotsOdd: f.m % 2 };
    }
    return {};
  }
  // the figure a property singles out (all the others agree, it alone differs), or -1
  function singledOut(vals) {
    const g = new Map();
    vals.forEach((v, i) => { const k = String(v); if (!g.has(k)) g.set(k, []); g.get(k).push(i); });
    if (g.size !== 2) return -1;
    const [a, b] = Array.from(g.values());
    if (a.length === 1 && b.length > 1) return a[0];
    if (b.length === 1 && a.length > 1) return b[0];
    return -1;
  }
  function verifyOdd(d) {
    if (!OKEY[d.type]) return { ok: false, err: 'unknown odd-one-out type ' + d.type };
    if (!Array.isArray(d.figs) || d.figs.length < 4 || !(d.ans >= 0 && d.ans < d.figs.length)) return { ok: false, err: 'bad figures' };
    const sigs = d.figs.map((f) => JSON.stringify(Object.assign({}, f, { c: 0 })));
    if (uniq(sigs).length !== sigs.length) return { ok: false, err: 'two figures are the same' };
    for (const f of d.figs) {
      if (f.pts) { const q = cornerQuality(f.pts); if (q.turn < 14 || q.side < .2 || !simplePoly(f.pts)) return { ok: false, err: 'a polygon has a corner too shallow to see' }; }
      if (d.type === 'sym') { const s = mirrorScore(f.pts); if (s > .04 && s < .12) return { ok: false, err: 'a figure is nearly, but not quite, symmetric' }; }
      if (d.type === 'chiral' && !POLYO[f.b]) return { ok: false, err: 'unknown piece ' + f.b };
      if (d.type === 'dotsides' && !(f.n >= 3 && f.n <= 8 && f.m >= 1 && f.m <= 9)) return { ok: false, err: 'bad dots or sides' };
    }
    if (d.type === 'chiral') { const b = POLYO[d.figs[0].b]; if (d.figs.some((f) => f.b !== d.figs[0].b) || cellsCanon(b) === cellsCanon(b.map(([x, y]) => [-x, y]))) return { ok: false, err: 'the piece must be one shape that is not its own mirror image' }; }
    const F = d.figs.map((f) => oddFeatures(d.type, f)), key = OKEY[d.type];
    for (const name of Object.keys(F[0])) {
      const i = singledOut(F.map((x) => x[name]));
      if (name === key && i !== d.ans) return { ok: false, err: 'the ' + key + ' does not single out ' + LETTERS[d.ans] };
      if (name !== key && i >= 0 && i !== d.ans) return { ok: false, err: 'the ' + name + ' singles out ' + LETTERS[i] + ' as well' };
    }
    return { ok: true };
  }
  // the figures, drawn in a 100 × 100 box
  function oddDraw(type, f, o) {
    const col = (o && o.col) || OCOL[(f.c || 0) % OCOL.length];
    switch (type) {
      case 'same': return LAY.nest.draw({ o: f.o, s: f.s, f: f.f }, o);
      case 'sides': case 'sidepar': case 'sym': {
        let s = '<path d="' + pathOf(xf(f.pts, 50, 50, 40, 0)) + '" fill="' + col + '" fill-opacity=".28" stroke="' + col + '" stroke-width="3.4" stroke-linejoin="round"/>';
        if (o && o.axis) {
          const ax = mirrorAxis(f.pts), c = [50 + ax.c[0] * 40, 50 + ax.c[1] * 40], u = [Math.cos(ax.deg * RAD), Math.sin(ax.deg * RAD)];
          s += '<path d="M' + n1(c[0] - u[0] * 48) + ' ' + n1(c[1] - u[1] * 48) + 'L' + n1(c[0] + u[0] * 48) + ' ' + n1(c[1] + u[1] * 48) + '" stroke="' + INK + '" stroke-width="2" stroke-dasharray="5 4"/>';
        }
        return s;
      }
      case 'count': case 'parity': {
        const w = 72 / f.n, S = new Set(f.on);
        let s = '';
        for (let i = 0; i < f.n * f.n; i++) {
          const x = 14 + (i % f.n) * w, y = 14 + Math.floor(i / f.n) * w;
          s += '<rect x="' + n1(x + 1.5) + '" y="' + n1(y + 1.5) + '" width="' + n1(w - 3) + '" height="' + n1(w - 3) + '" rx="2.5" fill="' + (S.has(i) ? col : 'none') + '" stroke="' + (S.has(i) ? col : 'var(--ink-2)') + '" stroke-opacity="' + (S.has(i) ? 1 : .55) + '" stroke-width="2"/>';
        }
        return s;
      }
      case 'pie': {
        const S = new Set(f.on);
        let s = '';
        for (let i = 0; i < f.s; i++) {
          const a0 = (f.r + i * 360 / f.s - 90) * RAD, a1 = (f.r + (i + 1) * 360 / f.s - 90) * RAD;
          const p0 = [50 + 40 * Math.cos(a0), 50 + 40 * Math.sin(a0)], p1 = [50 + 40 * Math.cos(a1), 50 + 40 * Math.sin(a1)];
          s += '<path d="M50 50L' + n1(p0[0]) + ' ' + n1(p0[1]) + 'A40 40 0 0 1 ' + n1(p1[0]) + ' ' + n1(p1[1]) + 'Z" fill="' + (S.has(i) ? col : 'none') + '" stroke="var(--ink-2)" stroke-width="2" stroke-linejoin="round"/>';
        }
        return s + '<circle cx="50" cy="50" r="40" fill="none" stroke="' + INK + '" stroke-width="3"/>';
      }
      case 'chiral': {
        const cells = figCells(f);
        const xs = cells.map((p) => p[0]), ys = cells.map((p) => p[1]);
        const x0 = Math.min(...xs), x1 = Math.max(...xs) + 1, y0 = Math.min(...ys), y1 = Math.max(...ys) + 1;
        const u = Math.min(64 / (x1 - x0), 64 / (y1 - y0), 17);
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        const P = (x, y) => xf([[(x - cx) * u, (y - cy) * u]], 50, 50, 1, f.a || 0)[0];
        let s = '';
        const edges = new Map();
        cells.forEach(([x, y]) => {
          s += '<path d="' + pathOf([P(x, y), P(x + 1, y), P(x + 1, y + 1), P(x, y + 1)]) + '" fill="' + col + '" fill-opacity=".45" stroke="' + col + '" stroke-opacity=".6" stroke-width="1.2"/>';
          [[x, y, x + 1, y], [x + 1, y, x + 1, y + 1], [x, y + 1, x + 1, y + 1], [x, y, x, y + 1]].forEach((e) => { const k = e.join(','); edges.set(k, (edges.get(k) || 0) + 1); });
        });
        let d = '';
        edges.forEach((cnt, k) => { if (cnt !== 1) return; const e = k.split(',').map(Number), a = P(e[0], e[1]), b = P(e[2], e[3]); d += 'M' + n1(a[0]) + ' ' + n1(a[1]) + 'L' + n1(b[0]) + ' ' + n1(b[1]); });
        return s + '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="3.4" stroke-linecap="round"/>';
      }
      case 'dotsides': {
        const poly = xf(ngon(f.n), 50, 50, f.n === 3 ? 46 : 42, f.r || 0), c = centroidOf(poly);
        let s = '<path d="' + pathOf(poly) + '" fill="' + col + '" fill-opacity=".18" stroke="' + col + '" stroke-width="3.2" stroke-linejoin="round"/>';
        const rho = f.m === 1 ? 0 : Math.min(15, f.n === 3 ? 12 : 16);
        for (let i = 0; i < f.m; i++) {
          const a = (f.r || 0) * RAD + i * 2 * Math.PI / f.m - Math.PI / 2;
          s += '<circle cx="' + n1(c[0] + rho * Math.cos(a)) + '" cy="' + n1(c[1] + rho * Math.sin(a)) + '" r="4.3" fill="' + INK + '"/>';
        }
        return s;
      }
    }
    return '';
  }
  function oddCaption(d, i) {
    const f = d.figs[i], F = oddFeatures(d.type, f);
    switch (d.type) {
      case 'same': return F.same ? 'same shape' : 'different!';
      case 'sides': case 'sidepar': return F.sides + ' sides';
      case 'sym': return F.sym ? 'mirror line' : 'none!';
      case 'count': case 'parity': return F.count + ' shaded';
      case 'pie': return F.count + ' shaded';
      case 'chiral': return F.hand === 'turned' ? 'turned' : 'flipped!';
      case 'dotsides': return f.n + ' sides, ' + f.m + ' dots';
    }
    return '';
  }
  function explainOdd(d) {
    const X = '**' + LETTERS[d.ans] + '**', f = d.figs[d.ans], F = d.figs.map((g) => oddFeatures(d.type, g));
    const other = F.find((x, i) => i !== d.ans);
    switch (d.type) {
      case 'same': return 'In every figure but ' + X + ' the small shape inside is the same kind of shape as the big one around it. In ' + X + ' a ' + f.s + ' sits inside a ' + f.o + '. (The shading is only there to distract you.)';
      case 'sides': return 'Count the sides. Every figure has ' + other.sides + ' — ' + (other.sides === 4 ? 'squares, oblongs, kites and lopsided ones alike' : 'however it is stretched or turned') + ' — except ' + X + ', which has ' + F[d.ans].sides + '.';
      case 'sidepar': return 'Count the sides: ' + andList(F.map((x, i) => LETTERS[i] + ' ' + x.sides)) + '. Every count is even except ' + X + '\'s ' + F[d.ans].sides + '.';
      case 'sym': return 'Every figure but ' + X + ' has a mirror line: fold it along the dashed line and the two halves land on each other. ' + X + ' has no such line — one of its corners is out of place.';
      case 'count': return 'Count the shaded squares: every figure has ' + other.count + ' except ' + X + ', which has ' + F[d.ans].count + '. Where the squares sit does not matter.';
      case 'parity': return 'Count the shaded squares: ' + andList(F.map((x, i) => LETTERS[i] + ' ' + x.count)) + '. The counts differ, but all of them are even except ' + X + '\'s ' + F[d.ans].count + '.';
      case 'pie': return 'Count the shaded slices: ' + other.count + ' in every circle except ' + X + ', which has ' + F[d.ans].count + '. Where they sit does not matter.';
      case 'chiral': return 'All the figures are the same piece turned round — except ' + X + ', which is its mirror image. No amount of turning makes it fit the others; you would have to pick it up and flip it over.';
      case 'dotsides': return 'In every figure the number of dots equals the number of sides — except ' + X + ', with ' + f.n + ' sides and ' + f.m + ' dots.';
    }
    return '';
  }
  const OHINT = {
    same: ['Look at the small shape and the big shape in each figure. How do the two go together?', 'In most of the figures the two shapes are of the same kind.'],
    sides: ['Forget colour, size and how the figures are turned: count something.', 'Count the sides of each figure.'],
    sidepar: ['Count the sides of each figure.', 'The counts are not all the same. What do most of them have in common? Think odd and even.'],
    sym: ['Imagine folding each figure in half.', 'Most of the figures have a mirror line: fold along it and the halves match exactly.'],
    count: ['Forget the pattern: count something.', 'Count the shaded squares in each figure.'],
    parity: ['Count the shaded squares in each figure.', 'The counts are not all the same. What do most of them have in common? Think odd and even.'],
    pie: ['Forget where the slices are: count something.', 'Count the shaded slices in each circle.'],
    chiral: ['These are all one piece turned round — or are they?', 'Turn each figure in your head until it matches another. One of them would have to be flipped over.'],
    dotsides: ['There are two things to count in each figure.', 'Compare the number of dots with the number of sides.']
  };
  const OTYPES = { 1: ['same', 'sides'], 2: ['sym', 'count', 'sides'], 3: ['chiral', 'count', 'sides'], 4: ['sym', 'dotsides', 'sides', 'pie'], 5: ['parity', 'chiral', 'sidepar', 'dotsides'] };
  function genOddType(rng, type, level) {
    const nf = level <= 2 ? 5 : 6, ans = rng.int(nf), cols = rng.shuffle(range(0, OCOL.length - 1));
    const figs = [];
    if (type === 'same') {
      const outs = rng.shuffle(OUTER.slice()).slice(0, nf);
      const fills = rng.shuffle(nf === 5 ? [0, 0, 3, 3, 3] : [0, 0, 2, 2, 3, 3]);
      if (rng() < .5) fills.forEach((v, i) => { fills[i] = v === 3 ? 2 : v; });
      outs.forEach((o, i) => {
        let s = o;
        if (i === ans) s = rng.pick(outs.filter((x) => x !== o));
        figs.push({ o, s, f: fills[i] });
      });
    } else if (type === 'sides' || type === 'sidepar') {
      let n, m, make;
      if (type === 'sidepar') { make = (k) => irregular(rng, k, rng() < .5); }
      else if (level <= 2) {
        n = rng.pick([3, 4, 4, 5, 6]); m = n === 3 ? 4 : n === 6 ? 5 : rng.pick([n - 1, n + 1]);
        const pools = {}, pickNamed = (k) => { pools[k] = pools[k] || rng.shuffle(NAMED[k].slice()); return pools[k].pop(); };
        make = pickNamed;
      } else { n = level === 3 ? rng.pick([5, 6]) : rng.pick([5, 6, 7]); m = n + rng.pick([-1, 1]); make = (k) => irregular(rng, k, level >= 4); }
      const evens = [4, 6, 8];
      for (let i = 0; i < nf; i++) {
        const k = type === 'sidepar' ? (i === ans ? rng.pick([5, 7]) : rng.pick(evens)) : (i === ans ? m : n);
        const pts = make(k);
        if (!pts) return null;
        figs.push({ pts: normUnit(xf(pts, 0, 0, 1, rng.int(24) * 15, rng() < .5)), c: cols[i] });
      }
    } else if (type === 'sym') {
      for (let i = 0; i < nf; i++) {
        const m = rng.pick([2, 3]), noB = rng() < .4;
        let pts = symPoly(rng, m, noB);
        if (pts && i === ans) pts = breakSym(rng, pts, m);
        if (!pts) return null;
        const deg = level <= 2 ? rng.int(4) * 90 : rng.int(72) * 5;
        figs.push({ pts: normUnit(xf(pts, 0, 0, 1, deg, rng() < .5)), c: cols[i] });
      }
    } else if (type === 'count' || type === 'parity') {
      const n = type === 'parity' ? 4 : 3;
      const k = level <= 2 ? rng.pick([2, 3]) : rng.pick([4, 5]);
      for (let i = 0; i < nf; i++) {
        let c;
        if (type === 'parity') c = i === ans ? rng.pick([5, 7]) : rng.pick([4, 6, 6, 8]);
        else c = i === ans ? k + rng.pick([-1, 1]) : k;
        figs.push({ n, on: rng.shuffle(range(0, n * n - 1)).slice(0, c).sort((a, b) => a - b), c: cols[i] });
      }
    } else if (type === 'pie') {
      const k = rng.pick([3, 4, 5]);
      for (let i = 0; i < nf; i++) {
        const c = i === ans ? k + rng.pick([-1, 1]) : k;
        figs.push({ s: 8, on: rng.shuffle(range(0, 7)).slice(0, c).sort((a, b) => a - b), r: rng.int(8) * 45, c: cols[i] });
      }
    } else if (type === 'chiral') {
      const b = rng.pick(level <= 3 ? ['L4', 'S4', 'F5', 'P5', 'N5'] : ['F5', 'N5', 'Y5', 'L5', 'R6']);
      // every figure in its own position: a quarter turn and (at level 3) maybe an eighth more, or a free tilt later on
      const poses = rng.shuffle(range(0, 7));
      for (let i = 0; i < nf; i++) figs.push({ b, m: i === ans ? 1 : 0, k: poses[i] % 4, a: level <= 3 ? (poses[i] >= 4 ? 45 : 0) : rng.pick([-1, 1]) * (10 + rng.int(6) * 5), c: cols[i] });
    } else if (type === 'dotsides') {
      for (let i = 0; i < nf; i++) {
        const n = rng.range(3, 7);
        figs.push({ n, m: i === ans ? n + rng.pick([-1, 1]) : n, r: rng.int(8) * 15, c: cols[i] });
      }
    }
    const d = { kind: 'odd', type, figs, ans };
    return verifyOdd(d).ok ? d : null;
  }
  function genOdd(rng, level, type) {
    for (let t = 0; t < 120; t++) {
      const d = genOddType(rng, type || rng.pick(OTYPES[level]), level);
      if (d) return d;
    }
    return null;
  }

  /* ---------- paper: fold, punch, unfold ----------
   * The sheet is 0..100 square. Every fold is along a mirror line of the
   * folded paper as it lies (so the flap lands exactly on the rest). The paper
   * is a list of faces: a piece of the sheet (in sheet coordinates) and the map
   * that carries it to where it lies now; a fold reflects the faces on the
   * moving side. A punch goes through every face; unfolding carries each hole
   * back through the inverse map, which also turns a pointed hole over. */

  const SHEET = [[0, 0], [100, 0], [100, 100], [0, 100]];
  const MID = [1, 0, 0, 1, 0, 0];
  function mmul(P, Q) { return [P[0] * Q[0] + P[2] * Q[1], P[1] * Q[0] + P[3] * Q[1], P[0] * Q[2] + P[2] * Q[3], P[1] * Q[2] + P[3] * Q[3], P[0] * Q[4] + P[2] * Q[5] + P[4], P[1] * Q[4] + P[3] * Q[5] + P[5]]; }
  function mapp(M, p) { return [M[0] * p[0] + M[2] * p[1] + M[4], M[1] * p[0] + M[3] * p[1] + M[5]]; }
  function minv(M) {
    const det = M[0] * M[3] - M[1] * M[2], a = M[3] / det, b = -M[1] / det, c = -M[2] / det, d = M[0] / det;
    return [a, b, c, d, -(a * M[4] + c * M[5]), -(b * M[4] + d * M[5])];
  }
  function mreflect(p, q) {
    const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const a = 2 * ux * ux - 1, b = 2 * ux * uy, d = 2 * uy * uy - 1;
    return [a, b, b, d, p[0] - (a * p[0] + b * p[1]), p[1] - (b * p[0] + d * p[1])];
  }
  // keep the part of a convex polygon on one side of the line p -> q (sgn +1: the left, in maths terms)
  function clipHalf(poly, p, q, sgn) {
    const side = (x) => sgn * ((q[0] - p[0]) * (x[1] - p[1]) - (q[1] - p[1]) * (x[0] - p[0]));
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const A = poly[i], B = poly[(i + 1) % poly.length], sa = side(A), sb = side(B);
      if (sa >= -1e-9) out.push(A);
      if ((sa > 1e-9 && sb < -1e-9) || (sa < -1e-9 && sb > 1e-9)) { const t = sa / (sa - sb); out.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]); }
    }
    return out;
  }
  function hullOf(pts) {
    const P = pts.map((p) => [Math.round(p[0] * 1e6) / 1e6, Math.round(p[1] * 1e6) / 1e6]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const p of P) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 1e-9) lo.pop(); lo.push(p); }
    for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; while (hi.length >= 2 && cr(hi[hi.length - 2], hi[hi.length - 1], p) <= 1e-9) hi.pop(); hi.push(p); }
    return lo.slice(0, -1).concat(hi.slice(0, -1));
  }
  // the paper after each fold: [faces before any fold, after fold 1, …]
  function paperStates(folds) {
    let faces = [{ poly: SHEET.map((p) => p.slice()), M: MID.slice(), z: 0 }];
    const states = [faces];
    for (const f of folds) {
      const p = [f[0], f[1]], q = [f[2], f[3]], s = f[4], R = mreflect(p, q);
      const zmax = Math.max(...faces.map((F) => F.z)), next = [];
      for (const F of faces) {
        const cur = F.poly.map((pt) => mapp(F.M, pt)), inv = minv(F.M);
        const keep = clipHalf(cur, p, q, -s), move = clipHalf(cur, p, q, s);
        if (keep.length >= 3 && Math.abs(areaOf(keep)) > 1e-6) next.push({ poly: keep.map((pt) => mapp(inv, pt)), M: F.M, z: F.z });
        if (move.length >= 3 && Math.abs(areaOf(move)) > 1e-6) next.push({ poly: move.map((pt) => mapp(inv, pt)), M: mmul(R, F.M), z: 2 * zmax + 1 - F.z });
      }
      faces = next;
      states.push(faces);
    }
    return states;
  }
  const stateOutline = (faces) => hullOf([].concat(...faces.map((F) => F.poly.map((p) => mapp(F.M, p)))));
  // the mirror lines of the paper as it lies: the middle lines of a rectangle (and the diagonals of a square), the axis of a right isosceles triangle
  function foldChoices(H) {
    const xs = H.map((p) => p[0]), ys = H.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const near = (a, b) => Math.abs(a - b) < 1e-6, out = [];
    if (H.length === 4 && H.every((p) => (near(p[0], x0) || near(p[0], x1)) && (near(p[1], y0) || near(p[1], y1)))) {
      out.push({ k: 'v', p: [cx, y0], q: [cx, y1] }, { k: 'h', p: [x0, cy], q: [x1, cy] });
      if (near(x1 - x0, y1 - y0)) out.push({ k: 'd', p: [x0, y0], q: [x1, y1] }, { k: 'd', p: [x1, y0], q: [x0, y1] });
    } else if (H.length === 3) {
      for (let i = 0; i < 3; i++) {
        const A = H[i], B = H[(i + 1) % 3], Q = H[(i + 2) % 3];
        const dot = (B[0] - A[0]) * (Q[0] - A[0]) + (B[1] - A[1]) * (Q[1] - A[1]);
        if (Math.abs(dot) < 1e-6 && near(Math.hypot(B[0] - A[0], B[1] - A[1]), Math.hypot(Q[0] - A[0], Q[1] - A[1]))) out.push({ k: 'a', p: A, q: [(B[0] + Q[0]) / 2, (B[1] + Q[1]) / 2] });
      }
    }
    return out;
  }
  const HOLE = {
    o: { per: 1, poly: regular(24, 5.5, 0) },
    s: { per: 90, poly: [[-4.7, -4.7], [4.7, -4.7], [4.7, 4.7], [-4.7, 4.7]] },
    t: { per: 120, poly: regular(3, 7.2, 0) },
    d: { per: 360, poly: [[-2.6, -6.6]].concat(range(-6, 6).map((i) => [-2.6 + 6.6 * Math.cos(i * 15 * RAD), 6.6 * Math.sin(i * 15 * RAD)]), [[-2.6, 6.6]]) }
  };
  const HOLEW = { o: 'round', s: 'square', t: 'triangular', d: 'half-moon' };
  function canonHole(h) {
    const per = HOLE[h[2]].per;
    return [Math.round(h[0] * 2) / 2, Math.round(h[1] * 2) / 2, h[2], per === 1 ? 0 : ((Math.round(h[3]) % per) + per) % per];
  }
  const holesKey = (H) => H.map((h) => canonHole(h).join(',')).sort().join(';');
  function holePoly(h) { return xf(HOLE[h[2]].poly, h[0], h[1], 1, h[3]); }
  // punch through every layer, then carry the holes back to the flat sheet
  function unfoldHoles(folds, punches, keepAngle) {
    const st = paperStates(folds), faces = st[st.length - 1], out = [];
    for (const [x, y, h, a] of punches) {
      for (const F of faces) {
        const cur = F.poly.map((p) => mapp(F.M, p));
        if (!inPoly([x, y], cur) || edgeDist([x, y], cur) < 1) continue;
        const inv = minv(F.M), p = mapp(inv, [x, y]);
        const u = [Math.cos(a * RAD), Math.sin(a * RAD)], v = [inv[0] * u[0] + inv[2] * u[1], inv[1] * u[0] + inv[3] * u[1]];
        out.push(canonHole([p[0], p[1], h, keepAngle ? a : Math.atan2(v[1], v[0]) / RAD]));
      }
    }
    return out;
  }
  // the holes as they sit on the paper at some stage (for the step-by-step unfolding)
  function holesAtState(faces, holes) {
    const out = [];
    for (const F of faces) {
      for (const h of holes) {
        if (!inPoly([h[0], h[1]], F.poly) || edgeDist([h[0], h[1]], F.poly) < 1) continue;
        const p = mapp(F.M, [h[0], h[1]]), u = [Math.cos(h[3] * RAD), Math.sin(h[3] * RAD)], v = [F.M[0] * u[0] + F.M[2] * u[1], F.M[1] * u[0] + F.M[3] * u[1]];
        out.push(canonHole([p[0], p[1], h[2], Math.atan2(v[1], v[0]) / RAD]));
      }
    }
    return out;
  }
  function holesOk(H) {
    if (H.some((h) => h[0] < 6 || h[0] > 94 || h[1] < 6 || h[1] > 94)) return false;
    for (let i = 0; i < H.length; i++) for (let j = i + 1; j < H.length; j++) if (Math.hypot(H[i][0] - H[j][0], H[i][1] - H[j][1]) < 12.5) return false;
    return true;
  }
  function foldMistakes(rng, folds, punches, correct) {
    const T = (H, fn) => H.map(([x, y, h, a]) => { const r = fn(x, y, a); return canonHole([r[0], r[1], h, r[2]]); });
    const first = [], later = [];
    if (folds.length > 1) first.push(unfoldHoles(folds.slice(0, -1), punches));
    first.push(punches.map(canonHole));
    if (punches.some((p) => p[2] !== 'o')) first.push(unfoldHoles(folds, punches, true));
    later.push(T(correct, (x, y, a) => [100 - x, y, 180 - a]), T(correct, (x, y, a) => [x, 100 - y, -a]), T(correct, (x, y, a) => [y, x, 90 - a]),
      T(correct, (x, y, a) => [100 - y, x, a + 90]), T(correct, (x, y, a) => [100 - y, 100 - x, -90 - a]));
    if (correct.length > 2) { const i = rng.int(correct.length); later.push(correct.filter((_, j) => j !== i)); }
    const h = rng.pick(correct), extra = [[100 - h[0], h[1], h[2], 180 - h[3]], [h[0], 100 - h[1], h[2], -h[3]], [100 - h[0], 100 - h[1], h[2], h[3] + 180]].map(canonHole);
    extra.forEach((e) => later.push(correct.concat([e])));
    const seen = new Set([holesKey(correct)]), out = [];
    first.concat(rng.shuffle(later)).forEach((H) => {
      const k = holesKey(H);
      if (!H.length || seen.has(k) || !holesOk(H)) return;
      seen.add(k); out.push(H.map(canonHole));
    });
    return out;
  }
  const FOLDSPEC = {
    1: { n: [1], kinds: ['v', 'h'], punch: [1], shapes: ['o'], opts: 4 },
    2: { n: [1, 2], kinds: ['v', 'h', 'd'], punch: [1, 2], shapes: ['o', 'o', 's'], opts: 5 },
    3: { n: [2], kinds: ['v', 'h', 'd', 'a'], punch: [1, 2], shapes: ['o', 's', 't'], opts: 6 },
    4: { n: [2, 3], kinds: ['v', 'h', 'd', 'a'], punch: [2], shapes: ['t', 'd', 'o'], opts: 6 },
    5: { n: [3], kinds: ['v', 'h', 'd', 'a'], punch: [2, 3], shapes: ['t', 'd', 's'], opts: 6 }
  };
  function genFold(rng, level) {
    const sp = FOLDSPEC[level];
    for (let tries = 0; tries < 80; tries++) {
      const nf = rng.pick(sp.n), folds = [];
      let ok = true;
      for (let i = 0; i < nf && ok; i++) {
        const st = paperStates(folds), H = stateOutline(st[st.length - 1]);
        const ch = foldChoices(H).filter((c) => sp.kinds.includes(c.k));
        if (!ch.length) { ok = false; break; }
        const c = rng.pick(ch);
        folds.push([c.p[0], c.p[1], c.q[0], c.q[1], rng() < .5 ? 1 : -1].map((v) => Math.round(v * 1e4) / 1e4));
      }
      if (!ok) continue;
      if (level >= 3 && !folds.some((f) => f[0] !== f[2] && f[1] !== f[3]) && rng() < .5) continue;   // prefer a slanting fold at the harder levels
      const st = paperStates(folds), H = stateOutline(st[st.length - 1]);
      const np = rng.pick(sp.punch), punches = [];
      for (let t = 0; t < 200 && punches.length < np; t++) {
        const xs = H.map((p) => p[0]), ys = H.map((p) => p[1]);
        const p = [Math.round(Math.min(...xs) + rng() * (Math.max(...xs) - Math.min(...xs))), Math.round(Math.min(...ys) + rng() * (Math.max(...ys) - Math.min(...ys)))];
        if (!inPoly(p, H) || edgeDist(p, H) < 8.5 || punches.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 17)) continue;
        const sh = rng.pick(sp.shapes);
        punches.push([p[0], p[1], sh, sh === 'o' ? 0 : rng.int(level >= 5 ? 8 : 4) * (level >= 5 ? 45 : 90)]);
      }
      if (punches.length < np) continue;
      const correct = unfoldHoles(folds, punches);
      if (!holesOk(correct)) continue;
      const wrong = foldMistakes(rng, folds, punches, correct);
      if (wrong.length < sp.opts - 1) continue;
      const opts = rng.shuffle([correct].concat(wrong.slice(0, sp.opts - 1)));
      const k = holesKey(correct);
      const d = { kind: 'fold', folds, punch: punches, opts, ans: opts.findIndex((H) => holesKey(H) === k) };
      if (verifyFold(d).ok) return d;
    }
    return null;
  }
  function verifyFold(d) {
    if (!Array.isArray(d.folds) || !d.folds.length || !Array.isArray(d.punch) || !d.punch.length) return { ok: false, err: 'folds and punches are needed' };
    for (let i = 0; i < d.folds.length; i++) {
      const st = paperStates(d.folds.slice(0, i)), H = stateOutline(st[st.length - 1]), f = d.folds[i];
      const same = (a, b) => Math.abs(a[0] - b[0]) < 1e-3 && Math.abs(a[1] - b[1]) < 1e-3;
      if (!foldChoices(H).some((c) => (same(c.p, [f[0], f[1]]) && same(c.q, [f[2], f[3]])) || (same(c.q, [f[0], f[1]]) && same(c.p, [f[2], f[3]])))) return { ok: false, err: 'fold ' + (i + 1) + ' is not along a mirror line of the folded paper' };
      if (Math.abs(f[4]) !== 1) return { ok: false, err: 'fold ' + (i + 1) + ' needs a side' };
    }
    const st = paperStates(d.folds), H = stateOutline(st[st.length - 1]);
    for (const p of d.punch) if (!HOLE[p[2]] || !inPoly([p[0], p[1]], H) || edgeDist([p[0], p[1]], H) < 7) return { ok: false, err: 'a punch is too near an edge or a fold' };
    const correct = unfoldHoles(d.folds, d.punch);
    if (correct.length !== d.punch.length * st[st.length - 1].length) return { ok: false, err: 'a punch misses some layers' };
    if (!holesOk(correct)) return { ok: false, err: 'the holes overlap once unfolded' };
    if (!Array.isArray(d.opts) || d.opts.length < 3 || !(d.ans >= 0 && d.ans < d.opts.length)) return { ok: false, err: 'bad options' };
    const keys = d.opts.map(holesKey);
    if (uniq(keys).length !== keys.length) return { ok: false, err: 'two options are the same' };
    const k = holesKey(correct), fits = keys.map((x, i) => (x === k ? i : -1)).filter((i) => i >= 0);
    if (fits.length !== 1 || fits[0] !== d.ans) return { ok: false, err: 'the unfolded sheet is not option ' + LETTERS[d.ans] };
    return { ok: true };
  }
  const PAPER = 'var(--paper)', EDGE = '#a8987a', HOLEC = '#2a2e45';
  // a flat sheet with holes (and the creases, dotted), in a 100 box
  function sheetSVG(holes, creases) {
    let s = '<rect x="0" y="0" width="100" height="100" rx="1.5" fill="' + PAPER + '" stroke="' + EDGE + '" stroke-width="1.6"/>';
    (creases || []).forEach(([a, b]) => { s += '<path d="M' + n1(a[0]) + ' ' + n1(a[1]) + 'L' + n1(b[0]) + ' ' + n1(b[1]) + '" stroke="' + EDGE + '" stroke-width="1" stroke-dasharray="2.5 2.5"/>'; });
    holes.forEach((h) => { s += '<path d="' + pathOf(holePoly(h)) + '" fill="' + HOLEC + '" stroke="#11131f" stroke-width=".8" stroke-linejoin="round"/>'; });
    return s;
  }
  // the creases of the unfolded sheet: every edge between two faces
  function creasesOf(folds) {
    const st = paperStates(folds), faces = st[st.length - 1], seen = new Set(), out = [];
    const onBorder = (a, b) => (Math.abs(a[0] - b[0]) < 1e-6 && (Math.abs(a[0]) < 1e-6 || Math.abs(a[0] - 100) < 1e-6)) || (Math.abs(a[1] - b[1]) < 1e-6 && (Math.abs(a[1]) < 1e-6 || Math.abs(a[1] - 100) < 1e-6));
    faces.forEach((F) => F.poly.forEach((a, i) => {
      const b = F.poly[(i + 1) % F.poly.length];
      if (onBorder(a, b) || Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6) return;
      const k = [a, b].map((p) => Math.round(p[0] * 10) + ',' + Math.round(p[1] * 10)).sort().join('|');
      if (!seen.has(k)) { seen.add(k); out.push([a, b]); }
    }));
    return out;
  }
  // the folded paper at one stage: the faces as they lie now (top layer last), with holes if given
  function stateSVG(faces, holes, o) {
    o = o || {};
    let s = '';
    const order = faces.slice().sort((a, b) => a.z - b.z);
    order.forEach((F, i) => {
      const cur = F.poly.map((p) => mapp(F.M, p));
      const back = (F.M[0] * F.M[3] - F.M[1] * F.M[2]) < 0;
      s += '<path d="' + pathOf(cur) + '" fill="' + (back ? 'var(--paper-back)' : PAPER) + '" stroke="' + EDGE + '" stroke-width="' + (i === order.length - 1 ? 1.6 : 1) + '" stroke-linejoin="round"/>';
    });
    (holes || []).forEach((h) => { s += '<path d="' + pathOf(holePoly(h)) + '" fill="' + HOLEC + '" stroke="#11131f" stroke-width=".8" stroke-linejoin="round"/>'; });
    if (o.fold) {
      const f = o.fold, p = [f[0], f[1]], q = [f[2], f[3]], dir = [q[0] - p[0], q[1] - p[1]], L = Math.hypot(dir[0], dir[1]);
      const u = [dir[0] / L, dir[1] / L], nrm = [-u[1] * f[4], u[0] * f[4]];
      s += '<path d="M' + n1(p[0] - u[0] * 6) + ' ' + n1(p[1] - u[1] * 6) + 'L' + n1(q[0] + u[0] * 6) + ' ' + n1(q[1] + u[1] * 6) + '" stroke="var(--accent)" stroke-width="2.4" stroke-dasharray="6 4" stroke-linecap="round"/>';
      // a curved arrow from the moving side over the line
      const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      const H = stateOutline(faces);
      let reach = 30;
      for (let t = 4; t < 80; t += 2) { const x = [m[0] + nrm[0] * t, m[1] + nrm[1] * t]; if (!inPoly(x, H)) { reach = t - 4; break; } }
      reach = Math.max(10, Math.min(reach * .7, 26));
      const a = [m[0] + nrm[0] * reach, m[1] + nrm[1] * reach], b = [m[0] - nrm[0] * reach, m[1] - nrm[1] * reach];
      const c = [m[0] + u[0] * reach * .9, m[1] + u[1] * reach * .9];
      const end = [b[0] + (c[0] - b[0]) * .25, b[1] + (c[1] - b[1]) * .25];
      const td = [b[0] - end[0], b[1] - end[1]], tl = Math.hypot(td[0], td[1]) || 1, tu = [td[0] / tl, td[1] / tl], tp = [-tu[1], tu[0]];
      s += '<path d="M' + n1(a[0]) + ' ' + n1(a[1]) + 'Q' + n1(c[0]) + ' ' + n1(c[1]) + ' ' + n1(b[0]) + ' ' + n1(b[1]) + '" fill="none" stroke="var(--pink)" stroke-width="2.6" stroke-linecap="round"/>';
      s += '<path d="' + pathOf([[b[0] + tu[0] * 2, b[1] + tu[1] * 2], [b[0] - tu[0] * 7 + tp[0] * 4.5, b[1] - tu[1] * 7 + tp[1] * 4.5], [b[0] - tu[0] * 7 - tp[0] * 4.5, b[1] - tu[1] * 7 - tp[1] * 4.5]]) + '" fill="var(--pink)"/>';
    }
    return s;
  }
  function explainFold(d) {
    const n = d.folds.length, layers = Math.pow(2, n);
    const shapes = uniq(d.punch.map((p) => p[2]));
    const num = (k) => (k <= 10 ? NUMW[k] : String(k));
    let s = 'After ' + num(n) + ' fold' + (n > 1 ? 's' : '') + ' the paper is ' + num(layers) + ' layers thick, so ' + (d.punch.length > 1 ? 'every punch makes ' + num(layers) + ' holes: ' + num(layers * d.punch.length) + ' in all.' : 'the punch makes ' + num(layers) + ' holes.');
    s += ' Unfold one step at a time, last fold first: each fold is a mirror, so the holes are reflected across its crease.';
    if (shapes.some((h) => h !== 'o' && h !== 's')) s += ' A mirror also turns a pointed hole round, so the reflected ' + andList(shapes.filter((h) => h === 't' || h === 'd').map((h) => HOLEW[h])) + ' holes point the other way.';
    return s + '\n\nThe unfolded sheet is **' + LETTERS[d.ans] + '**.';
  }

  /* ---------- mirror images ---------- */

  const MCOL = ['var(--accent)', 'var(--gold)', 'var(--pink)', 'var(--teal)'];
  const MT = {
    v: (n) => (r, c) => [r, n - 1 - c], h: (n) => (r, c) => [n - 1 - r, c], r180: (n) => (r, c) => [n - 1 - r, n - 1 - c],
    r90: (n) => (r, c) => [c, n - 1 - r], t: () => (r, c) => [c, r], at: (n) => (r, c) => [n - 1 - c, n - 1 - r], id: () => (r, c) => [r, c]
  };
  const mapCells = (cells, fn) => cells.map(([r, c, k]) => { const [a, b] = fn(r, c); return [a, b, k]; });
  const cellsKey = (cells) => cells.map((c) => c.join(',')).sort().join(';');
  function mirrorAnswer(d) { return mapCells(d.cells, MT[d.axis](d.n)); }
  function genMirror(rng, level) {
    const n = level <= 1 ? 4 : 5, nopt = level <= 1 ? 4 : 5;
    for (let t = 0; t < 200; t++) {
      const axis = rng.pick(['v', 'h']), k = rng.range(level <= 1 ? 4 : 6, level <= 1 ? 6 : 8), ncol = level <= 1 ? 2 : 3;
      const cells = rng.shuffle(range(0, n * n - 1)).slice(0, k).map((id) => [Math.floor(id / n), id % n, rng.int(ncol)]);
      if (uniq(cells.map((c) => c[2])).length < ncol) continue;
      const right = mirrorAnswer({ n, cells, axis }), seen = new Set([cellsKey(right)]), wrong = [];
      const push = (cs) => { const key = cellsKey(cs); if (!seen.has(key)) { seen.add(key); wrong.push(cs); } };
      push(cells);
      push(mapCells(cells, MT[axis === 'v' ? 'h' : 'v'](n)));
      rng.shuffle(['r180', 'r90', 't', 'at']).forEach((m) => push(mapCells(cells, MT[m](n))));
      // the right reflection with one square in the wrong colour or the wrong place
      const j = rng.int(right.length);
      push(right.map((c, i) => (i === j ? [c[0], c[1], (c[2] + 1) % ncol] : c)));
      const occ = new Set(right.map((c) => c[0] * n + c[1]));
      const free = range(0, n * n - 1).filter((id) => !occ.has(id) && Math.abs(Math.floor(id / n) - right[j][0]) + Math.abs(id % n - right[j][1]) === 1);
      if (free.length) { const id = rng.pick(free); push(right.map((c, i) => (i === j ? [Math.floor(id / n), id % n, c[2]] : c))); }
      if (wrong.length < nopt - 1) continue;
      // the tempting ones first: not reflected at all, the other mirror, a near miss
      const pickW = [wrong[0], wrong[1]].concat(rng.shuffle(wrong.slice(2))).slice(0, nopt - 1);
      const opts = rng.shuffle([right].concat(pickW)), key = cellsKey(right);
      const d = { kind: 'mirror', n, cells, axis, opts, ans: opts.findIndex((o) => cellsKey(o) === key) };
      if (verifyMirror(d).ok) return d;
    }
    return null;
  }
  function verifyMirror(d) {
    if (!(d.n >= 3 && d.n <= 6) || !MT[d.axis] || !Array.isArray(d.cells) || !d.cells.length) return { ok: false, err: 'bad mirror figure' };
    const inside = (cs) => cs.every(([r, c]) => r >= 0 && r < d.n && c >= 0 && c < d.n) && uniq(cs.map(([r, c]) => r * d.n + c)).length === cs.length;
    if (!inside(d.cells) || !d.opts.every(inside)) return { ok: false, err: 'a square is off the grid or doubled' };
    const right = cellsKey(mirrorAnswer(d));
    if (right === cellsKey(d.cells)) return { ok: false, err: 'the figure is its own mirror image' };
    const keys = d.opts.map(cellsKey);
    if (uniq(keys).length !== keys.length) return { ok: false, err: 'two options are the same' };
    const fits = keys.map((k, i) => (k === right ? i : -1)).filter((i) => i >= 0);
    if (fits.length !== 1 || fits[0] !== d.ans) return { ok: false, err: 'the reflection is not option ' + LETTERS[d.ans] };
    return { ok: true };
  }
  function cellsSVG(n, cells, o) {
    const w = 84 / n;
    let s = '';
    for (let i = 0; i < n * n; i++) s += '<rect x="' + n1(8 + (i % n) * w + 1) + '" y="' + n1(8 + Math.floor(i / n) * w + 1) + '" width="' + n1(w - 2) + '" height="' + n1(w - 2) + '" rx="2" fill="none" stroke="var(--grid-2)" stroke-width="1.4"/>';
    cells.forEach(([r, c, k]) => { s += '<rect x="' + n1(8 + c * w + 1.5) + '" y="' + n1(8 + r * w + 1.5) + '" width="' + n1(w - 3) + '" height="' + n1(w - 3) + '" rx="3" fill="' + ((o && o.col) || MCOL[k % MCOL.length]) + '"/>'; });
    return s;
  }
  function explainMirror(d) {
    return 'A mirror swaps ' + (d.axis === 'v' ? 'left and right but keeps top and bottom' : 'top and bottom but keeps left and right') + ': each square lands the same distance from the mirror on the other side, in the same colour. The reflection is **' + LETTERS[d.ans] + '**. The traps: the figure copied without reflecting, reflected the wrong way, turned instead of reflected, or with one square astray.';
  }

  /* ---------- spot the difference: scenes made of parts ----------
   * A scene is a list of parts (a house, a boat, a clock …), each drawn from a
   * few parameters in its own coordinates, placed at (x, y) with a scale and a
   * mirror flag. A difference changes one parameter of one part in one of the
   * two pictures; its region (a circle) is what the player must click. The
   * whole scene is rebuilt from its seed, so verify re-derives everything. */

  const SW = 400, SH = 280, OUT = '#3d3346';
  const f1 = n1;
  const rect = (x, y, w, h, fill, x2) => '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="' + f1(h) + '" fill="' + fill + '"' + (x2 || '') + '/>';
  const circ = (x, y, r, fill, x2) => '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '" fill="' + fill + '"' + (x2 || '') + '/>';
  const ell = (x, y, rx, ry, fill, x2) => '<ellipse cx="' + f1(x) + '" cy="' + f1(y) + '" rx="' + f1(rx) + '" ry="' + f1(ry) + '" fill="' + fill + '"' + (x2 || '') + '/>';
  const path = (d, fill, x2) => '<path d="' + d + '" fill="' + fill + '"' + (x2 || '') + '/>';
  const poly = (pts, fill, x2) => path(pathOf(pts), fill, x2);
  const ol = (w) => ' stroke="' + OUT + '" stroke-width="' + (w || 1.6) + '" stroke-linejoin="round"';
  const line = (x1, y1, x2, y2, col, w, x3) => '<path d="M' + f1(x1) + ' ' + f1(y1) + 'L' + f1(x2) + ' ' + f1(y2) + '" stroke="' + col + '" stroke-width="' + (w || 1.6) + '" stroke-linecap="round"' + (x3 || '') + '/>';

  const PAL = {
    sky: ['#aee0f7', '#ffd9bd', '#cbd6ff', '#c3efe3'],
    sun: ['#ffd23f', '#ff8c42', '#fff5c0'],
    wall: ['#f6c86b', '#ef8f73', '#94c9ea', '#f5efe0', '#b7dc9f', '#d7a9e3'],
    roof: ['#c9473d', '#566cc0', '#7a5139', '#2f8a6a'],
    door: ['#6b3f2a', '#2d6cdf', '#d64b8a', '#f2c230'],
    crown: ['#5cb85c', '#2e8b57', '#e8912e', '#a4d65e'],
    petal: ['#ff6b9a', '#ffffff', '#a98bff', '#ff9f1c', '#e63946'],
    box: ['#d9423b', '#3b6fd9', '#3a9a5b'],
    balloon: ['#ff4d6d', '#ffd23f', '#4dabf7', '#9b5de5'],
    hull: ['#c9473d', '#2d6cdf', '#f2c230', '#2f8a6a', '#f5efe0'],
    sail: ['#ffffff', '#ff8c42', '#e63946', '#8ecae6'],
    lamp: ['#ffd23f', '#e63946', '#4dabf7'],
    fish: ['#ff8c42', '#ffd23f', '#e63946', '#8ecae6'],
    buoy: ['#e63946', '#ffd23f', '#3a9a5b'],
    curtain: ['#d64b8a', '#3a9a5b', '#566cc0', '#f2c230'],
    frame: ['#c89b3c', '#6b3f2a', '#3d3346', '#b0b7c3'],
    rim: ['#e63946', '#3d3346', '#2d6cdf', '#3a9a5b'],
    book: ['#e63946', '#2d6cdf', '#f2c230', '#3a9a5b', '#9b5de5', '#ff8c42', '#40c4c4'],
    shade: ['#ffd23f', '#ff8fab', '#8ecae6', '#b7dc9f'],
    bowl: ['#4dabf7', '#f5efe0', '#e8912e'],
    grape: ['#7b2cbf', '#8bc34a'],
    cat: ['#f4a259', '#8d99ae', '#3d3346', '#f1ede4'],
    pot: ['#c8553d', '#4dabf7', '#f2c230'],
    rug: ['#e63946', '#2d6cdf', '#3a9a5b', '#9b5de5'],
    mug: ['#e63946', '#4dabf7', '#f2c230', '#f5efe0'],
    tile: ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51', '#f1faee', '#a8dadc', '#6d597a'],
    kite: ['#e63946', '#4dabf7', '#ffd23f', '#9b5de5']
  };
  const pc = (pal, i) => PAL[pal][((i % PAL[pal].length) + PAL[pal].length) % PAL[pal].length];

  // every kind: box(P) its outline box in its own coordinates, draw(P), what it is called, and the changes it allows (from a level)
  const K = {};
  K.sky = { name: 'the sky', bg: true, box: () => [0, 0, SW, SH], draw: (P) => rect(0, 0, SW, SH, pc('sky', P.c)) + rect(0, SH * .45, SW, SH * .55, '#ffffff', ' opacity=".22"'), ops: [] };
  K.sun = {
    name: 'the sun', box: () => [-27, -27, 27, 27],
    draw(P) {
      let s = '';
      for (let i = 0; i < 8; i++) { const a = i * 45 * RAD; s += line(Math.cos(a) * 20, Math.sin(a) * 20, Math.cos(a) * 26, Math.sin(a) * 26, pc('sun', P.c), 3.2); }
      return s + circ(0, 0, 16, pc('sun', P.c), ' stroke="#e0a100" stroke-opacity=".5" stroke-width="1.5"');
    },
    ops: [{ op: 'color', key: 'c', pal: 'sun', lv: 1 }, { op: 'remove', lv: 1 }, { op: 'size', lv: 3 }]
  };
  K.moon = { name: 'the moon', box: () => [-16, -16, 16, 16], draw: () => path('M4 -15A15 15 0 1 0 12 9A12 12 0 1 1 4 -15Z', '#fff5c0', ol(1)), ops: [{ op: 'remove', lv: 1 }, { op: 'mirror', lv: 3 }] };
  const PUFF = [[-18, 0, 12], [0, -8, 16], [18, 0, 12], [33, 3, 9]];
  K.cloud = {
    name: 'a cloud', box: (P) => [-30, -24, P.n > 3 ? 42 : 30, 12],
    draw(P) { let s = ''; PUFF.slice(0, P.n).forEach(([x, y, r]) => { s += circ(x, y, r, '#ffffff', ' stroke="#c9d6e3" stroke-width="1.4"'); }); PUFF.slice(0, P.n).forEach(([x, y, r]) => { s += circ(x, y, r - 1.5, '#ffffff'); }); return s + rect(-28, 0, P.n > 3 ? 68 : 56, 8, '#ffffff') ; },
    slot: (P, i) => { const [x, y, r] = PUFF[i]; return [x - r, y - r, x + r, y + r]; },
    ops: [{ op: 'remove', lv: 1 }, { op: 'size', lv: 2 }, { op: 'shift', lv: 3 }, { op: 'count', key: 'n', min: 4, max: 4, lv: 3, noun: 'puff of cloud' }]
  };
  K.hills = {
    name: 'the hills', bg: true, box: () => [0, 0, SW, SH],
    draw(P) {
      const g = [['#9fd67a', '#6fbf59'], ['#b5d98a', '#7cae4f'], ['#a8d5a2', '#5fa36a']][P.c % 3];
      return path('M0 ' + P.a + 'Q100 ' + (P.a - 40) + ' 200 ' + (P.a - 6) + 'T400 ' + (P.a - 20) + 'L400 280L0 280Z', g[0]) +
        path('M0 ' + P.b + 'Q140 ' + (P.b - 26) + ' 260 ' + (P.b - 4) + 'T400 ' + (P.b - 10) + 'L400 280L0 280Z', g[1]);
    },
    ops: []
  };
  K.house = {
    name: 'the house', box: () => [-36, -82, 36, 0],
    draw(P) {
      let s = '';
      if (P.ch) s += rect(12, -82, 10, 24, '#9c6b4e', ol());
      s += rect(-30, -46, 60, 46, pc('wall', P.w), ol());
      s += poly([[-37, -44], [0, -80], [37, -44]], pc('roof', P.r), ol());
      s += rect(-22, -25, 13, 25, pc('door', P.d), ol()) + circ(-12, -12, 1.4, '#3d3346');
      for (let i = 0; i < P.n; i++) { const x = 2 + i * 15; s += rect(x, -38, 12, 12, '#fdf1b8', ol(1.4)) + line(x + 6, -38, x + 6, -26, OUT, 1.1) + line(x, -32, x + 12, -32, OUT, 1.1); }
      return s;
    },
    parts: { r: [-37, -80, 37, -44], w: [-30, -46, 30, 0], d: [-22, -25, -9, 0], ch: [12, -82, 22, -64] },
    slot: (P, i) => [2 + i * 15, -38, 14 + i * 15, -26],
    ops: [{ op: 'color', key: 'r', pal: 'roof', lv: 1, what: 'roof' }, { op: 'color', key: 'w', pal: 'wall', lv: 1, what: 'walls' }, { op: 'color', key: 'd', pal: 'door', lv: 2, what: 'door' },
      { op: 'toggle', key: 'ch', lv: 2, what: 'chimney' }, { op: 'count', key: 'n', min: 1, max: 2, lv: 2, noun: 'window' }, { op: 'mirror', lv: 3 }, { op: 'remove', lv: 1 }]
  };
  const APPLES = [[-10, -58], [9, -62], [13, -45], [-15, -42], [1, -48]];
  K.tree = {
    name: 'the tree', box: (P) => (P.t ? [-24, -90, 24, 0] : [-31, -78, 31, 0]),
    draw(P) {
      let s = rect(-5, -34, 10, 34, '#8b5a2b', ol(1.4));
      const col = pc('crown', P.c);
      if (P.t) {
        s += poly([[0, -90], [-18, -58], [18, -58]], col, ol()) + poly([[0, -74], [-22, -40], [22, -40]], col, ol()) + poly([[0, -58], [-24, -26], [24, -26]], col, ol());
        return s;
      }
      s += circ(-15, -42, 15, col, ol()) + circ(15, -42, 15, col, ol()) + circ(0, -54, 23, col, ol()) + circ(-15, -42, 13.4, col) + circ(15, -42, 13.4, col);
      s += circ(-6, -60, 8, '#ffffff', ' opacity=".18"');
      APPLES.slice(0, P.n).forEach(([x, y]) => { s += circ(x, y, 3.8, '#e63946', ol(1)); });
      return s;
    },
    parts: { c: [-31, -78, 31, -27] },
    slot: (P, i) => [APPLES[i][0] - 4, APPLES[i][1] - 4, APPLES[i][0] + 4, APPLES[i][1] + 4],
    ops: [{ op: 'color', key: 'c', pal: 'crown', lv: 1, what: 'leaves' }, { op: 'count', key: 'n', min: 1, max: 5, lv: 2, noun: 'apple', ok: (P) => !P.t }, { op: 'remove', lv: 1 }, { op: 'size', lv: 3 }]
  };
  K.fence = {
    name: 'the fence', box: (P) => [-2, -30, P.n * 10 + 1, 0],
    draw(P) {
      let s = rect(-2, -21, P.n * 10 + 2, 4, P.c ? '#b07a4f' : '#f5efe0', ol(1.2)) + rect(-2, -10, P.n * 10 + 2, 4, P.c ? '#b07a4f' : '#f5efe0', ol(1.2));
      for (let i = 0; i < P.n; i++) s += poly([[i * 10, 0], [i * 10, -25], [i * 10 + 3.5, -30], [i * 10 + 7, -25], [i * 10 + 7, 0]], P.c ? '#c98d5c' : '#fbf8f0', ol(1.2));
      return s;
    },
    slot: (P, i) => [i * 10 - 1, -31, i * 10 + 8, 0],
    ops: [{ op: 'count', key: 'n', min: 5, max: 9, lv: 2, noun: 'fence post' }, { op: 'toggle', key: 'c', lv: 3, what: 'colour', full: true }]
  };
  K.flower = {
    name: 'a flower', box: () => [-8, -28, 8, 0],
    draw(P) {
      let s = line(0, 0, 0, -16, '#3a9a5b', 2) + ell(4, -8, 4, 2, '#3a9a5b', ' transform="rotate(-30 4 -8)"');
      for (let i = 0; i < 5; i++) { const a = (i * 72 - 90) * RAD; s += circ(Math.cos(a) * 4.6, -20 + Math.sin(a) * 4.6, 3.8, pc('petal', P.c), ' stroke="' + OUT + '" stroke-width=".8"'); }
      return s + circ(0, -20, 2.6, '#ffd23f');
    },
    ops: [{ op: 'color', key: 'c', pal: 'petal', lv: 2, what: 'petals' }, { op: 'remove', lv: 3 }]
  };
  K.bird = {
    name: 'a bird', box: () => [-11, -8, 12, 7],
    draw(P) {
      const c = P.c ? '#2d6cdf' : '#3d3346';
      return ell(0, 0, 8, 5, c) + path('M-3 -1Q2 -12 7 -3Z', c, ' opacity=".8"') + poly([[7, -2], [12, 0], [7, 2]], '#ff8c42') + path('M-7 0L-12 -4L-11 2Z', c) + circ(4.5, -1.5, 1, '#ffffff');
    },
    ops: [{ op: 'remove', lv: 2 }, { op: 'mirror', lv: 3 }, { op: 'shift', lv: 4 }, { op: 'toggle', key: 'c', lv: 4, what: 'colour', full: true }]
  };
  K.sheep = {
    name: 'the sheep', box: () => [-20, -28, 25, 0],
    draw(P) {
      let s = line(-10, -8, -10, 0, OUT, 2.4) + line(-3, -8, -3, 0, OUT, 2.4) + line(5, -8, 5, 0, OUT, 2.4) + line(11, -8, 11, 0, OUT, 2.4);
      [[-12, -16, 8], [-3, -20, 9], [7, -18, 8], [0, -12, 9], [-9, -10, 7], [9, -11, 7]].forEach(([x, y, r]) => { s += circ(x, y, r, '#ffffff', ' stroke="#b9b3a8" stroke-width="1.2"'); });
      [[-12, -16, 6.8], [-3, -20, 7.8], [7, -18, 6.8], [0, -12, 7.8]].forEach(([x, y, r]) => { s += circ(x, y, r, '#ffffff'); });
      s += ell(17, -18, 5.6, 7, P.h ? '#6b3f2a' : '#3d3346', ' transform="rotate(20 17 -18)"') + circ(19, -20, 1.2, '#ffffff') + ell(13, -24, 3, 1.6, P.h ? '#6b3f2a' : '#3d3346');
      return s;
    },
    parts: { h: [11, -27, 24, -10] },
    ops: [{ op: 'remove', lv: 1 }, { op: 'mirror', lv: 3 }, { op: 'toggle', key: 'h', lv: 4, what: 'face' }]
  };
  K.mailbox = {
    name: 'the letterbox', box: () => [-12, -44, 15, 0],
    draw(P) {
      let s = rect(-2, -26, 4, 26, '#8b5a2b', ol(1.2)) + path('M-11 -26L-11 -36A11 8 0 0 1 11 -36L11 -26Z', pc('box', P.c), ol(1.4));
      s += P.f ? rect(10, -44, 2.4, 16, '#6b3f2a') + poly([[12.4, -44], [21, -41], [12.4, -38]], '#e63946', ol(1)) : rect(10, -31, 12, 2.4, '#6b3f2a') + poly([[20, -31], [23, -36], [23, -28]], '#e63946', ol(1));
      return s;
    },
    parts: { f: [9, -45, 23, -27] },
    ops: [{ op: 'toggle', key: 'f', lv: 3, what: 'flag' }, { op: 'color', key: 'c', pal: 'box', lv: 2, what: 'box' }, { op: 'mirror', lv: 4 }]
  };
  K.balloon = {
    name: 'the balloon', box: () => [-10, -52, 10, 0],
    draw: (P) => path('M0 -30Q-4 -18 2 -10T0 0', 'none', ' stroke="' + OUT + '" stroke-width="1"') + ell(0, -41, 9.5, 11.5, pc('balloon', P.c), ol(1.2)) + poly([[-2, -29], [2, -29], [0, -31]], pc('balloon', P.c)) + ell(-3, -45, 2.4, 3.6, '#ffffff', ' opacity=".5"'),
    ops: [{ op: 'color', key: 'c', pal: 'balloon', lv: 1, what: 'colour', full: true }, { op: 'remove', lv: 2 }, { op: 'shift', lv: 4 }]
  };
  K.kite = {
    name: 'the kite', box: () => [-16, -22, 26, 40],
    draw(P) {
      let s = path('M0 18Q10 26 4 32T14 40', 'none', ' stroke="' + OUT + '" stroke-width="1.2"');
      s += poly([[0, -22], [14, -2], [0, 18], [-14, -2]], pc('kite', P.c), ol(1.4)) + line(0, -22, 0, 18, OUT, 1) + line(-14, -2, 14, -2, OUT, 1);
      s += poly([[4, 30], [9, 27], [8, 34]], '#ffd23f') + poly([[11, 38], [16, 36], [15, 42]], '#e63946');
      return s;
    },
    ops: [{ op: 'color', key: 'c', pal: 'kite', lv: 1, what: 'colour', full: true }, { op: 'mirror', lv: 4 }, { op: 'remove', lv: 2 }]
  };
  // the harbour
  K.sea = {
    name: 'the sea', bg: true, box: () => [0, 0, SW, SH],
    draw(P) {
      let s = rect(0, P.y, SW, SH - P.y, '#3d8fd1') + rect(0, P.y, SW, 6, '#6fb3e6');
      for (let r = 0; r < 5; r++) for (let i = 0; i < 6; i++) { const x = 20 + i * 70 + (r % 2) * 35, y = P.y + 22 + r * 20; s += path('M' + x + ' ' + y + 'q6 -5 12 0t12 0', 'none', ' stroke="#8cc8f0" stroke-width="1.6" stroke-linecap="round"'); }
      return s;
    },
    ops: []
  };
  K.rocks = { name: 'the rocks', bg: true, box: () => [-40, -16, 40, 6], draw: () => ell(-16, -2, 22, 12, '#8d99ae', ol(1.2)) + ell(14, 0, 24, 10, '#7a8699', ol(1.2)) + ell(0, -8, 14, 9, '#a3adbf', ol(1.2)), ops: [] };
  const STRIPE = [[-14, -26, 28], [-12.5, -52, 25], [-11, -78, 22]];
  K.lighthouse = {
    name: 'the lighthouse', box: () => [-17, -122, 17, 0],
    draw(P) {
      let s = poly([[-15, 0], [-10, -92], [10, -92], [15, 0]], '#fbf8f0', ol());
      STRIPE.slice(0, P.n).forEach(([x, y, w]) => { s += poly([[x, y], [x + 1.2, y - 12], [x + w - 1.2, y - 12], [x + w, y]], '#e63946'); });
      s += poly([[-15, 0], [-10, -92], [10, -92], [15, 0]], 'none', ol()) + rect(-5, -14, 10, 14, '#6b3f2a', ol(1.2));
      s += rect(-14, -96, 28, 5, '#3d3346') + rect(-8, -110, 16, 14, pc('lamp', P.l), ol(1.4)) + line(0, -110, 0, -96, OUT, 1) + poly([[-11, -110], [0, -122], [11, -110]], pc('roof', P.r), ol(1.4));
      return s;
    },
    parts: { l: [-8, -110, 8, -96], r: [-11, -122, 11, -110] },
    slot: (P, i) => [STRIPE[i][0], STRIPE[i][1] - 12, STRIPE[i][0] + STRIPE[i][2], STRIPE[i][1]],
    ops: [{ op: 'count', key: 'n', min: 2, max: 3, lv: 2, noun: 'red stripe' }, { op: 'color', key: 'l', pal: 'lamp', lv: 2, what: 'lamp' }, { op: 'color', key: 'r', pal: 'roof', lv: 1, what: 'roof' }, { op: 'size', lv: 4 }]
  };
  const PORT = [-14, -2, 10];
  K.boat = {
    name: 'the boat', box: () => [-32, -66, 32, 6],
    draw(P) {
      let s = line(0, -10, 0, -62, '#6b3f2a', 2.4);
      s += poly([[3, -60], [3, -14], [27, -14]], pc('sail', P.s), ol(1.4)) + poly([[-3, -52], [-3, -14], [-20, -14]], pc('sail', P.s), ol(1.4) + ' opacity=".92"');
      if (P.f) s += poly([[0, -66], [11, -63], [0, -60]], '#e63946', ol(1));
      s += path('M-31 -12L31 -12L22 5L-24 5Z', pc('hull', P.h), ol());
      PORT.slice(0, P.n).forEach((x) => { s += circ(x, -4, 2.6, '#dff1ff', ol(1)); });
      return s;
    },
    parts: { h: [-31, -12, 31, 5], s: [-20, -60, 27, -14], f: [0, -67, 12, -59] },
    slot: (P, i) => [PORT[i] - 4, -8, PORT[i] + 4, 0],
    ops: [{ op: 'color', key: 'h', pal: 'hull', lv: 1, what: 'hull' }, { op: 'color', key: 's', pal: 'sail', lv: 1, what: 'sails' }, { op: 'toggle', key: 'f', lv: 2, what: 'flag' },
      { op: 'count', key: 'n', min: 1, max: 3, lv: 3, noun: 'porthole' }, { op: 'mirror', lv: 3 }, { op: 'shift', lv: 4 }]
  };
  K.gull = { name: 'a gull', box: () => [-12, -6, 12, 4], draw: () => path('M-12 -2Q-6 -8 0 0Q6 -8 12 -2', 'none', ' stroke="' + OUT + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"'), ops: [{ op: 'remove', lv: 2 }, { op: 'shift', lv: 4 }] };
  K.buoy = {
    name: 'the buoy', box: () => [-9, -26, 9, 4],
    draw: (P) => poly([[-8, 0], [0, -20], [8, 0]], pc('buoy', P.c), ol(1.2)) + rect(-5.5, -8, 11, 3.5, '#ffffff') + circ(0, -22, 3, '#ffd23f', ol(1)) + ell(0, 1, 10, 3, '#2a74b5'),
    ops: [{ op: 'color', key: 'c', pal: 'buoy', lv: 2, what: 'colour', full: true }, { op: 'remove', lv: 3 }]
  };
  K.fish = {
    name: 'the jumping fish', box: () => [-15, -10, 16, 9],
    draw: (P) => '<g transform="rotate(-25)">' + ell(0, 0, 11, 6, pc('fish', P.c), ol(1.2)) + poly([[-10, 0], [-17, -6], [-17, 6]], pc('fish', P.c), ol(1.2)) + circ(6, -1.5, 1.4, OUT) + '</g>' + path('M-14 12q4 -3 8 0', 'none', ' stroke="#ffffff" stroke-width="1.4"'),
    ops: [{ op: 'color', key: 'c', pal: 'fish', lv: 2, what: 'colour', full: true }, { op: 'mirror', lv: 3 }, { op: 'remove', lv: 2 }]
  };
  const LEAF = [-150, -110, -70, -30, 10];
  K.island = {
    name: 'the island', box: () => [-44, -66, 44, 6],
    draw(P) {
      let s = ell(0, 0, 42, 11, '#f2d49b', ol(1.4)) + path('M-2 -4Q-6 -30 6 -54', 'none', ' stroke="#8b5a2b" stroke-width="4.5" stroke-linecap="round"');
      LEAF.slice(0, P.n).forEach((a) => { s += ell(6 + Math.cos(a * RAD) * 13, -56 + Math.sin(a * RAD) * 7, 14, 4.2, '#3a9a5b', ol(1) + ' transform="rotate(' + (a + 180) + ' ' + f1(6 + Math.cos(a * RAD) * 13) + ' ' + f1(-56 + Math.sin(a * RAD) * 7) + ')"'); });
      if (P.k) s += circ(3, -51, 2.8, '#6b3f2a') + circ(8, -50, 2.8, '#6b3f2a');
      return s;
    },
    parts: { k: [0, -55, 12, -47] },
    slot: (P, i) => { const a = LEAF[i] * RAD, x = 6 + Math.cos(a) * 13, y = -56 + Math.sin(a) * 7; return [x - 10, y - 8, x + 10, y + 8]; },
    ops: [{ op: 'count', key: 'n', min: 4, max: 5, lv: 3, noun: 'palm leaf' }, { op: 'toggle', key: 'k', lv: 4, what: 'coconuts' }, { op: 'mirror', lv: 4 }]
  };

  // the room
  K.wall = {
    name: 'the wall', bg: true, box: () => [0, 0, SW, SH],
    draw(P) {
      let s = rect(0, 0, SW, 204, ['#f3e3c3', '#d8e8f0', '#eadcf0', '#dcebd3'][P.c % 4]);
      for (let x = 20; x < SW; x += 40) s += rect(x, 0, 14, 196, '#ffffff', ' opacity=".16"');
      s += rect(0, 204, SW, SH - 204, '#c99a6b');
      for (let y = 218; y < SH; y += 16) s += line(0, y, SW, y, '#b07f52', 1.2);
      return s + rect(0, 196, SW, 9, '#fbf8f0', ' stroke="#d9cdb4" stroke-width="1"');
    },
    ops: []
  };
  K.window = {
    name: 'the window', box: () => [-42, -96, 42, 0],
    draw(P) {
      let s = rect(-30, -86, 60, 78, P.v ? '#2b3a67' : '#aee0f7');
      if (P.s) s += P.v ? circ(13, -67, 7, '#fff5c0') : circ(13, -67, 8, '#ffd23f');
      if (!P.v) s += ell(-12, -30, 12, 5, '#ffffff', ' opacity=".8"');
      s += rect(-30, -86, 60, 78, 'none', ' stroke="#fbf8f0" stroke-width="5"') + line(0, -86, 0, -8, '#fbf8f0', 4) + line(-30, -47, 30, -47, '#fbf8f0', 4) + rect(-36, -8, 72, 7, '#fbf8f0', ol(1.2));
      const c = pc('curtain', P.c);
      s += line(-46, -94, 46, -94, '#6b3f2a', 3);
      s += path('M-44 -93L-24 -93Q-28 -60 -34 -40Q-30 -20 -36 -6L-44 -6Z', c, ol(1.2)) + path('M44 -93L24 -93Q28 -60 34 -40Q30 -20 36 -6L44 -6Z', c, ol(1.2));
      return s;
    },
    parts: { c: [-46, -95, 46, -5], s: [4, -76, 22, -58] },
    ops: [{ op: 'color', key: 'c', pal: 'curtain', lv: 1, what: 'curtains' }, { op: 'toggle', key: 's', lv: 3, what: P0 => (P0 && P0.v ? 'moon' : 'sun'), in: 'in the window' }]
  };
  K.frame = {
    name: 'the picture', box: () => [-28, -44, 28, 0],
    draw(P) {
      let s = rect(-28, -44, 56, 44, pc('frame', P.c), ol(1.4)) + rect(-22, -38, 44, 32, '#cfe8f7');
      if (P.s) s += circ(-12, -29, 4.5, '#ffd23f');
      s += poly([[-22, -6], [-9, -30], [-1, -19], [6, -26], [22, -6]], '#6fbf59') + poly([[-9, -30], [-5, -23], [-12, -24]], '#ffffff');
      return s;
    },
    parts: { s: [-18, -35, -6, -23] },
    ops: [{ op: 'color', key: 'c', pal: 'frame', lv: 2, what: 'frame', full: true }, { op: 'toggle', key: 's', lv: 3, what: 'sun', in: 'in the picture' }, { op: 'mirror', lv: 3 }]
  };
  K.clock = {
    name: 'the clock', box: () => [-21, -42, 21, 0],
    draw(P) {
      let s = circ(0, -21, 19, '#fffdf6', ' stroke="' + pc('rim', P.c) + '" stroke-width="4"');
      for (let i = 0; i < 12; i++) { const a = i * 30 * RAD; s += line(Math.sin(a) * 13, -21 - Math.cos(a) * 13, Math.sin(a) * 15.5, -21 - Math.cos(a) * 15.5, OUT, i % 3 ? 1 : 2); }
      const h = (P.h * 30 + P.m * 7.5) * RAD, m = P.m * 90 * RAD;
      return s + line(0, -21, Math.sin(h) * 8.5, -21 - Math.cos(h) * 8.5, OUT, 2.8) + line(0, -21, Math.sin(m) * 13, -21 - Math.cos(m) * 13, OUT, 1.8) + circ(0, -21, 1.8, OUT);
    },
    ops: [{ op: 'color', key: 'c', pal: 'rim', lv: 2, what: 'rim', full: true }, { op: 'time', lv: 3 }]
  };
  K.shelf = {
    name: 'the bookshelf', box: (P) => [-50, -34, 50, 8],
    draw(P) {
      let s = '', x = -46;
      for (let i = 0; i < P.n; i++) { s += rect(x, -P.bh[i], P.bw[i], P.bh[i], pc('book', P.bc[i]), ol(1.1)) + line(x + 2, -P.bh[i] + 5, x + P.bw[i] - 2, -P.bh[i] + 5, '#ffffff', 1, ' opacity=".55"'); x += P.bw[i] + 1; }
      return s + rect(-50, 0, 100, 6, '#9c6b4e', ol(1.2)) + poly([[-40, 6], [-34, 6], [-40, 14]], '#7a5139') + poly([[40, 6], [34, 6], [40, 14]], '#7a5139');
    },
    slot(P, i) { let x = -46; for (let j = 0; j < i; j++) x += P.bw[j] + 1; return [x, -P.bh[i], x + P.bw[i], 0]; },
    ops: [{ op: 'count', key: 'n', min: 4, max: 7, lv: 2, noun: 'book' }, { op: 'colorAt', key: 'bc', pal: 'book', lv: 3, noun: 'book' }]
  };
  K.lamp = {
    name: 'the lamp', box: () => [-18, -104, 18, 0],
    draw(P) {
      let s = '';
      if (P.g) for (let i = -2; i <= 2; i++) s += line(i * 5, -74, i * 9, -60, '#ffd23f', 2.2, ' opacity=".85"');
      return s + ell(0, -2, 13, 4, '#3d3346') + line(0, -3, 0, -78, '#6b6f80', 2.6) + poly([[-16, -78], [-9, -100], [9, -100], [16, -78]], pc('shade', P.c), ol(1.4));
    },
    parts: { c: [-16, -100, 16, -78], g: [-19, -76, 19, -58] },
    ops: [{ op: 'color', key: 'c', pal: 'shade', lv: 1, what: 'lampshade' }, { op: 'toggle', key: 'g', lv: 3, what: 'light', in: 'under the lamp' }]
  };
  K.table = {
    name: 'the table', bg: true, box: () => [-62, -52, 62, 0],
    draw: () => rect(-62, -52, 124, 8, '#a8744a', ol(1.4)) + rect(-54, -44, 7, 44, '#8b5a2b', ol(1.2)) + rect(47, -44, 7, 44, '#8b5a2b', ol(1.2)),
    ops: []
  };
  const FRUIT = [[-13, -12], [1, -15], [14, -11]];
  K.bowl = {
    name: 'the fruit bowl', box: () => [-28, -34, 28, 0],
    draw(P) {
      let s = '';
      if (P.b) s += path('M-2 -20Q10 -32 24 -22Q12 -26 -2 -20Z', '#ffd23f', ol(1.2));
      for (let i = 0; i < 5; i++) s += circ(-12 + (i % 3) * 4, -21 - Math.floor(i / 3) * 4 + (i % 2), 2.8, pc('grape', P.g), ol(.8));
      FRUIT.slice(0, P.n).forEach(([x, y]) => { s += circ(x, y, 7, '#e63946', ol(1.2)) + line(x, y - 7, x + 1, y - 10, '#6b3f2a', 1.4); });
      return s + path('M-26 -10A26 12 0 0 0 26 -10Z', pc('bowl', P.c), ol(1.4)) + rect(-7, 0, 14, 2.5, '#9c6b4e');
    },
    parts: { b: [-3, -30, 25, -18], g: [-16, -28, -4, -16] },
    slot: (P, i) => [FRUIT[i][0] - 7, FRUIT[i][1] - 10, FRUIT[i][0] + 7, FRUIT[i][1] + 5],
    ops: [{ op: 'count', key: 'n', min: 2, max: 3, lv: 2, noun: 'apple' }, { op: 'toggle', key: 'b', lv: 3, what: 'banana', in: 'in the bowl' }, { op: 'color', key: 'g', pal: 'grape', lv: 3, what: 'grapes' }, { op: 'color', key: 'c', pal: 'bowl', lv: 2, what: 'bowl', full: true }]
  };
  K.cat = {
    name: 'the cat', box: () => [-18, -44, 27, 0],
    draw(P) {
      const c = pc('cat', P.c);
      let s = path('M12 -4Q30 -6 24 -26', 'none', ' stroke="' + OUT + '" stroke-width="6" stroke-linecap="round"') + path('M12 -4Q30 -6 24 -26', 'none', ' stroke="' + c + '" stroke-width="3.6" stroke-linecap="round"');
      s += ell(0, -14, 14, 14, c, ol()) + circ(-3, -32, 9.5, c, ol()) + poly([[-11, -36], [-11, -46], [-4, -40]], c, ol(1.2)) + poly([[5, -36], [5, -46], [-2, -40]], c, ol(1.2));
      s += ell(-6.5, -33, 1.3, 2, OUT) + ell(0.5, -33, 1.3, 2, OUT) + poly([[-4, -29.5], [-2, -29.5], [-3, -28]], '#ff8fab');
      if (P.s) s += path('M-8 -22Q0 -18 8 -22M-11 -14Q0 -9 11 -14M-9 -6Q0 -2 9 -6', 'none', ' stroke="' + OUT + '" stroke-width="1.4" opacity=".5"');
      return s;
    },
    parts: { s: [-12, -24, 12, -2] },
    ops: [{ op: 'color', key: 'c', pal: 'cat', lv: 2, what: 'fur', full: true }, { op: 'mirror', lv: 3 }, { op: 'remove', lv: 1 }, { op: 'toggle', key: 's', lv: 4, what: 'stripes', in: 'on the cat' }]
  };
  const LEAVES = [-130, -100, -80, -60, -30];
  K.plant = {
    name: 'the plant', box: () => [-26, -58, 26, 0],
    draw(P) {
      let s = '';
      LEAVES.slice(0, P.n).forEach((a) => { const x = Math.cos(a * RAD) * 20, y = -18 + Math.sin(a * RAD) * 24; s += ell(x, y, 11, 4.6, '#3a9a5b', ol(1.1) + ' transform="rotate(' + a + ' ' + f1(x) + ' ' + f1(y) + ')"'); });
      return s + poly([[-11, 0], [-13, -18], [13, -18], [11, 0]], pc('pot', P.c), ol(1.3));
    },
    parts: { c: [-13, -18, 13, 0] },
    slot: (P, i) => { const a = LEAVES[i] * RAD, x = Math.cos(a) * 20, y = -18 + Math.sin(a) * 24; return [x - 10, y - 8, x + 10, y + 8]; },
    ops: [{ op: 'color', key: 'c', pal: 'pot', lv: 2, what: 'flowerpot' }, { op: 'count', key: 'n', min: 4, max: 5, lv: 3, noun: 'leaf' }]
  };
  K.rug = { name: 'the rug', box: () => [-70, -12, 70, 12], draw: (P) => ell(0, 0, 70, 12, pc('rug', P.c), ol(1.2)) + ell(0, 0, 54, 8, 'none', ' stroke="#ffffff" stroke-width="2" opacity=".7"'), ops: [{ op: 'color', key: 'c', pal: 'rug', lv: 1, what: 'colour', full: true }] };
  K.mug = {
    name: 'the mug', box: () => [-8, -14, 14, 0],
    draw: (P) => path('M6 -11Q13 -11 12 -6Q11 -2 6 -3', 'none', ' stroke="' + OUT + '" stroke-width="2"') + rect(-7, -14, 13, 14, pc('mug', P.c), ol(1.2)),
    ops: [{ op: 'color', key: 'c', pal: 'mug', lv: 3, what: 'colour', full: true }, { op: 'mirror', lv: 4 }, { op: 'remove', lv: 3 }]
  };
  // tiles
  K.tile = {
    name: 'a tile', box: () => [-21, -21, 21, 21],
    draw(P) {
      const f = pc('tile', P.f);
      let s = rect(-20, -20, 40, 40, pc('tile', P.b), ' rx="3"') + '<g transform="rotate(' + P.r * 90 + ')">';
      if (P.m === 0) s += path('M-20 -7A13 13 0 0 0 -7 -20L4 -20A24 24 0 0 1 -20 4Z', f) + path('M20 7A13 13 0 0 0 7 20L-4 20A24 24 0 0 1 20 -4Z', f);
      else if (P.m === 1) s += poly([[-20, -20], [20, -20], [-20, 20]], f, ' opacity=".95"');
      else if (P.m === 2) s += rect(-20, -13, 40, 8, f) + rect(-20, 5, 40, 8, f);
      else s += circ(0, 0, 11, 'none', ' stroke="' + f + '" stroke-width="5"');
      s += '</g>';
      if (P.d) s += circ(0, 0, 3.6, pc('tile', P.f + 3), ' stroke="' + OUT + '" stroke-width=".8"');
      return s;
    },
    parts: { d: [-5, -5, 5, 5] },
    ops: [{ op: 'rot', lv: 1, ok: (P) => P.m !== 3 }, { op: 'color', key: 'f', pal: 'tile', lv: 2, what: 'pattern', full: true }, { op: 'color', key: 'b', pal: 'tile', lv: 3, what: 'background', full: true }, { op: 'toggle', key: 'd', lv: 3, what: 'dot', in: 'in the middle' }]
  };

  /* the scenes */
  function spread(rng, n, lo, hi, minGap) {
    for (let t = 0; t < 200; t++) {
      const xs = range(1, n).map(() => lo + rng() * (hi - lo)).sort((a, b) => a - b);
      if (xs.every((x, i) => !i || x - xs[i - 1] >= minGap)) return xs.map(Math.round);
    }
    return null;
  }
  const P0 = (k, x, y, P, o) => Object.assign({ k, x, y, s: 1, fl: 1, P }, o || {});
  const THEMES = {
    village(rng, lv) {
      const out = [P0('sky', 0, 0, { c: rng.int(4) })];
      const sunX = 40 + rng.int(320);
      out.push(P0('sun', sunX, 42 + rng.int(18), { c: rng.int(2) }));
      const cx = spread(rng, 2 + (lv >= 3 ? 1 : 0), 40, 360, 95);
      if (!cx) return null;
      cx.forEach((x) => { if (Math.abs(x - sunX) > 55) out.push(P0('cloud', x, 36 + rng.int(40), { n: rng.pick([3, 4]) }, { s: .85 + rng() * .3 })); });
      range(1, 1 + rng.int(3)).forEach(() => out.push(P0('bird', 30 + rng.int(340), 70 + rng.int(50), { c: rng.int(2) }, { fl: rng() < .5 ? 1 : -1 })));
      if (rng() < .6) { const kite = rng() < .5; out.push(P0(kite ? 'kite' : 'balloon', 40 + rng.int(320), kite ? 52 + rng.int(28) : 96 + rng.int(30), { c: rng.int(4) })); }
      out.push(P0('hills', 0, 0, { c: rng.int(3), a: 150 + rng.int(14), b: 182 + rng.int(8) }));
      // the back row: houses and trees on the grass
      const back = rng.shuffle(['house'].concat(rng() < .6 ? ['house'] : [], ['tree', 'tree'], rng() < .5 ? ['tree'] : []));
      const xs = spread(rng, back.length, 40, 360, 78);
      if (!xs) return null;
      back.forEach((k, i) => {
        const y = 198 + rng.int(12);
        if (k === 'house') out.push(P0('house', xs[i], y, { w: rng.int(6), r: rng.int(4), d: rng.int(4), n: 1 + rng.int(2), ch: rng() < .7 ? 1 : 0 }, { fl: rng() < .5 ? 1 : -1 }));
        else { const t = rng() < .3 ? 1 : 0; out.push(P0('tree', xs[i], y + 4, { t, c: rng.int(4), n: t ? 0 : 2 + rng.int(4) }, { s: .9 + rng() * .25 })); }
      });
      // the middle: a fence and a letterbox
      const mid = spread(rng, 2, 30, 330, 110);
      if (mid) {
        out.push(P0('fence', mid[0], 226, { n: 5 + rng.int(4), c: rng.int(2) }));
        if (rng() < .7) out.push(P0('mailbox', mid[1] + 40, 232, { c: rng.int(3), f: rng.int(2) }, { fl: rng() < .5 ? 1 : -1 }));
      }
      // the front: sheep and flowers
      const front = ['sheep'].concat(rng() < .5 ? ['sheep'] : [], ['flower', 'flower', 'flower'], lv >= 3 ? ['flower', 'flower'] : []);
      const fx = spread(rng, front.length, 22, 378, 30);
      if (!fx) return null;
      rng.shuffle(front).forEach((k, i) => out.push(k === 'sheep' ? P0('sheep', fx[i], 258 + rng.int(12), { h: rng.int(2) }, { fl: rng() < .5 ? 1 : -1 }) : P0('flower', fx[i], 262 + rng.int(14), { c: rng.int(5) })));
      return out;
    },
    harbour(rng, lv) {
      const out = [P0('sky', 0, 0, { c: rng.int(4) })];
      const left = rng() < .5, lx = left ? 50 + rng.int(20) : 330 + rng.int(20);
      // the sun keeps clear of the lighthouse
      out.push(P0('sun', left ? 130 + rng.int(230) : 40 + rng.int(230), 40 + rng.int(20), { c: rng.int(3) }));
      const cx = spread(rng, 2, 40, 360, 110);
      if (cx) cx.forEach((x) => { if (Math.abs(x - out[1].x) > 60) out.push(P0('cloud', x, 40 + rng.int(40), { n: rng.pick([3, 4]) })); });
      range(1, 2 + rng.int(2)).forEach(() => out.push(P0('gull', 30 + rng.int(340), 80 + rng.int(50), {}, { s: .9 + rng() * .3 })));
      out.push(P0('sea', 0, 0, { y: 168 }));
      out.push(P0('rocks', lx, 186, {}), P0('lighthouse', lx, 176, { n: 2 + rng.int(2), l: rng.int(3), r: rng.int(4) }));
      const ix = left ? 250 + rng.int(60) : 90 + rng.int(60), island = rng() < .7;
      if (island) out.push(P0('island', ix, 176, { n: 4 + rng.int(2), k: rng.int(2) }, { fl: rng() < .5 ? 1 : -1 }));
      const bx = spread(rng, 2 + (lv >= 2 ? 1 : 0), 50, 350, 92);
      if (!bx) return null;
      // boats near the horizon keep clear of the lighthouse and the island; the others sail in front
      bx.forEach((x) => {
        const behind = Math.abs(x - lx) < 58 || (island && Math.abs(x - ix) < 60);
        out.push(P0('boat', x, (behind ? 252 : 214) + rng.int(10), { h: rng.int(5), s: rng.int(4), f: rng.int(2), n: rng.int(4) }, { fl: rng() < .5 ? 1 : -1, s: .9 + rng() * .2 }));
      });
      out.push(P0('buoy', 30 + rng.int(340), 196 + rng.int(12), { c: rng.int(3) }));
      if (rng() < .8) out.push(P0('fish', 30 + rng.int(340), 262 + rng.int(8), { c: rng.int(4) }, { fl: rng() < .5 ? 1 : -1 }));

      return out;
    },
    room(rng, lv) {
      const out = [P0('wall', 0, 0, { c: rng.int(4) })];
      // on the wall: the window, a picture, a clock, a shelf of books
      const wall = rng.shuffle(['window', 'frame', 'clock', 'shelf']);
      const xs = spread(rng, 4, 50, 350, 88);
      if (!xs) return null;
      wall.forEach((k, i) => {
        if (k === 'window') out.push(P0('window', xs[i], 150, { c: rng.int(4), s: rng.int(2), v: rng() < .25 ? 1 : 0 }));
        else if (k === 'frame') out.push(P0('frame', xs[i], 88 + rng.int(20), { c: rng.int(4), s: rng.int(2) }, { fl: rng() < .5 ? 1 : -1 }));
        else if (k === 'clock') out.push(P0('clock', xs[i], 60 + rng.int(30), { c: rng.int(4), h: rng.int(12), m: rng.int(4) }));
        else {
          const n = 4 + rng.int(3), bw = range(1, n).map(() => 8 + rng.int(5)), bh = range(1, n).map(() => 22 + rng.int(11)), bc = range(1, n).map(() => rng.int(7));
          if (bw.reduce((a, b) => a + b + 1, 0) > 90) return;
          out.push(P0('shelf', xs[i], 150 + rng.int(12), { n, bw, bh, bc }));
        }
      });
      // on the floor
      // on the floor, three zones side by side: the table, the rug with the cat, the lamp and the plant
      const [zt, zc, zl] = rng.shuffle([74, 200, 326]).map((x) => x + rng.int(11) - 5);
      out.push(P0('rug', zc, 262, { c: rng.int(4) }));
      out.push(P0('table', zt, 256, {}), P0('bowl', zt - 22 + rng.int(12), 204, { n: 2 + rng.int(2), b: rng.int(2), g: rng.int(2), c: rng.int(3) }));
      if (rng() < .8) out.push(P0('mug', zt + 36, 204, { c: rng.int(4) }, { fl: rng() < .5 ? 1 : -1 }));
      const lampLeft = rng() < .5;
      out.push(P0('lamp', zl + (lampLeft ? -30 : 30), 258, { c: rng.int(4), g: rng.int(2) }));
      out.push(P0('plant', zl + (lampLeft ? 26 : -26), 264, { c: rng.int(3), n: 3 + rng.int(3) }));
      out.push(P0('cat', zc + rng.int(21) - 10, 266, { c: rng.int(4), s: rng.int(2) }, { fl: rng() < .5 ? 1 : -1 }));
      return out;
    },
    tiles(rng, lv) {
      const cols = rng.shuffle(range(0, 7)).slice(0, 4);
      const motifs = rng.shuffle([0, 1, 2, 3]).slice(0, lv >= 5 ? 2 : 1);
      const out = [];
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 8; c++) {
          const m = rng.pick(motifs);
          out.push(P0('tile', 24 + 22 + c * 44, 8 + 22 + r * 44, { m, r: rng.int(4), b: (r + c) % 2 && lv >= 3 ? cols[1] : cols[0], f: rng() < .8 ? cols[2] : cols[3], d: rng() < .25 ? 1 : 0 }));
        }
      }
      return out;
    }
  };
  const THEMEW = { village: 'a village', harbour: 'a harbour', room: 'a sitting room', tiles: 'a tiled floor' };

  /* the differences */
  const MINAREA = [0, 700, 380, 240, 150, 90];
  const clone = (p) => JSON.parse(JSON.stringify(p));
  function worldBox(p, b) {
    const xs = [p.x + b[0] * p.s * p.fl, p.x + b[2] * p.s * p.fl], ys = [p.y + b[1] * p.s, p.y + b[3] * p.s];
    return [Math.min(xs[0], xs[1]), Math.min(ys[0], ys[1]), Math.max(xs[0], xs[1]), Math.max(ys[0], ys[1])];
  }
  const unionBox = (a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];
  const boxArea = (b) => Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]);
  const boxOverlap = (a, b) => boxArea([Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.min(a[3], b[3])]);
  function partSVG(p) {
    if (p.hide) return '';
    const d = K[p.k].draw(p.P);
    if (p.x === 0 && p.y === 0 && p.s === 1 && p.fl === 1) return d;
    return '<g transform="translate(' + f1(p.x) + ' ' + f1(p.y) + ') scale(' + n2(p.s * p.fl) + ' ' + n2(p.s) + ')">' + d + '</g>';
  }
  const n2 = (v) => Math.round(v * 1000) / 1000;
  function describe(p, op, a, b) {
    const kd = K[p.k], nm = kd.name, Nm = cap1(nm);
    const what = typeof op.what === 'function' ? op.what(p.P) : op.what;
    switch (op.op) {
      case 'color': return op.full ? Nm + ' changes colour.' : 'The ' + what + ' of ' + nm + ' change' + (/s$/.test(what) && what !== 'grass' ? '' : 's') + ' colour.';
      case 'colorAt': return 'A ' + op.noun + ' on ' + nm + ' changes colour.';
      case 'toggle': return op.full ? Nm + ' changes colour.' : 'The ' + what + ' ' + (op.in || 'on ' + nm) + ' is there in only one picture.';
      case 'count': return 'One picture has one ' + op.noun + ' fewer' + (p.k === 'tree' || p.k === 'house' || p.k === 'boat' || p.k === 'lighthouse' ? ' on ' + nm : '') + '.';
      case 'mirror': return Nm + ' faces the other way.';
      case 'remove': return Nm + ' is missing from one picture.';
      case 'size': return Nm + ' is ' + (b.s > a.s ? 'bigger' : 'smaller') + ' on the right.';
      case 'shift': return Nm + ' has moved.';
      case 'time': return 'The clock shows a different time.';
      case 'rot': return 'One of the tiles is turned a quarter turn.';
    }
    return '';
  }
  function makeDiff(rng, parts, i, op) {
    const p = parts[i], kd = K[p.k], P = p.P;
    if (op.ok && !op.ok(P)) return null;
    const a = clone(p), b = clone(p);
    let box = kd.box(P);
    switch (op.op) {
      case 'color': {
        // a tile's pattern and background must stay different colours, or the pattern would vanish
        const n = PAL[op.pal].length, clash = (v) => p.k === 'tile' && (op.key === 'f' ? v === P.b : v === P.f);
        let v = P[op.key];
        for (let t = 0; t < 30 && (v === P[op.key] || clash(v)); t++) v = rng.int(n);
        if (v === P[op.key] || clash(v)) return null;
        b.P[op.key] = v; if (!op.full && kd.parts && kd.parts[op.key]) box = kd.parts[op.key]; break; }
      case 'colorAt': { const j = rng.int(P.n), n = PAL[op.pal].length; let v = P[op.key][j]; for (let t = 0; t < 20 && v === P[op.key][j]; t++) v = rng.int(n); if (v === P[op.key][j]) return null; b.P[op.key][j] = v; box = kd.slot(P, j); break; }
      case 'toggle': b.P[op.key] = P[op.key] ? 0 : 1; if (!op.full) box = kd.parts[op.key]; break;
      case 'count': if (!(P[op.key] >= op.min)) return null; (rng() < .5 ? a : b).P[op.key] = P[op.key] - 1; box = kd.slot(P, P[op.key] - 1); break;
      case 'mirror': b.fl = -p.fl; break;
      case 'remove': (rng() < .5 ? a : b).hide = true; break;
      case 'size': b.s = n2(p.s * (rng() < .5 ? .72 : 1.32)); break;
      case 'shift': b.x = p.x + (rng() < .5 ? -1 : 1) * (18 + rng.int(8)); break;
      case 'time': b.P.h = (P.h + 3 + rng.int(6)) % 12; break;
      case 'rot': b.P.r = (P.r + 1) % 4; break;
      default: return null;
    }
    if (partSVG(a) === partSVG(b)) return null;
    const reg = unionBox(worldBox(a, box), worldBox(b, box));
    return { i, a, b, reg, op: op.op, what: describe(p, op, a, b) };
  }
  function chooseDiffs(rng, parts, lv, k) {
    const cands = [];
    parts.forEach((p, i) => { if (!K[p.k].bg) K[p.k].ops.forEach((op) => { if ((op.lv || 1) <= lv) cands.push({ i, op }); }); });
    rng.shuffle(cands);
    const chosen = [], used = new Set(), opCount = {};
    const boxes = parts.map((p) => worldBox(p, K[p.k].box(p.P)));
    for (let round = 0; round < k; round++) {
      // prefer kinds of change not used yet; at the hard levels, the small ones
      const order = cands.filter((c) => !used.has(c.i)).sort((x, y) => (opCount[x.op.op] || 0) - (opCount[y.op.op] || 0));
      let got = null;
      for (const c of order) {
        const d = makeDiff(rng, parts, c.i, c.op);
        if (!d) continue;
        const area = boxArea(d.reg);
        if (area < MINAREA[lv] || (lv >= 4 && area > 5200) || (lv <= 2 && area > 16000)) continue;
        const cx = (d.reg[0] + d.reg[2]) / 2, cy = (d.reg[1] + d.reg[3]) / 2, r = Math.max(13, Math.hypot(d.reg[2] - d.reg[0], d.reg[3] - d.reg[1]) / 2 + 3);
        if (cx < 10 || cx > SW - 10 || cy < 10 || cy > SH - 10) continue;
        // not hidden behind something drawn later
        if (parts.some((q, j) => j > c.i && !q.hide && !K[q.k].bg && boxOverlap(boxes[j], d.reg) > .3 * area)) continue;
        if (chosen.some((e) => Math.hypot(e.c[0] - cx, e.c[1] - cy) < e.c[2] + r + 4)) continue;
        d.c = [n2(cx), n2(cy), n2(r)];
        got = d;
        break;
      }
      if (!got) return null;
      chosen.push(got); used.add(got.i); opCount[got.op] = (opCount[got.op] || 0) + 1;
    }
    return chosen;
  }
  const SPOTK = [0, 3, 4, 5, 6, 7];
  function buildSpot(d) {
    const make = THEMES[d.theme];
    if (!make) return null;
    const rng = C.rng('spot:' + d.theme + ':' + d.seed + ':' + d.lv);
    for (let t = 0; t < 40; t++) {
      const parts = make(rng, d.lv);
      if (!parts) continue;
      const diffs = chooseDiffs(rng, parts, d.lv, d.k);
      if (!diffs) continue;
      const A = parts.map(clone), B = parts.map(clone);
      diffs.forEach((df) => { A[df.i] = df.a; B[df.i] = df.b; });
      return { A, B, diffs: diffs.map((df) => ({ c: df.c, what: df.what, op: df.op })), W: SW, H: SH };
    }
    return null;
  }
  function sceneSVG(parts) { return parts.map(partSVG).join(''); }
  function verifySpot(d) {
    if (!THEMES[d.theme]) return { ok: false, err: 'unknown theme ' + d.theme };
    if (!(d.k >= 1 && d.k <= 12) || !(d.lv >= 1 && d.lv <= 5)) return { ok: false, err: 'bad k or level' };
    const s = buildSpot(d);
    if (!s) return { ok: false, err: 'the scene could not be built with ' + d.k + ' differences' };
    if (s.diffs.length !== d.k) return { ok: false, err: 'wrong number of differences' };
    // every difference really shows, and they never share a place
    let changed = 0;
    s.A.forEach((p, i) => { if (partSVG(p) !== partSVG(s.B[i])) changed++; });
    if (changed !== d.k) return { ok: false, err: changed + ' parts differ, not ' + d.k };
    for (let i = 0; i < s.diffs.length; i++) for (let j = i + 1; j < s.diffs.length; j++) {
      const a = s.diffs[i].c, b = s.diffs[j].c;
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) < a[2] + b[2]) return { ok: false, err: 'two differences overlap' };
    }
    return { ok: true };
  }
  function genSpot(rng, level, theme) {
    const themes = level <= 2 ? ['village', 'harbour', 'room'] : ['village', 'harbour', 'room', 'tiles'];
    for (let t = 0; t < 10; t++) {
      const d = { kind: 'spot', theme: theme || rng.pick(themes), seed: rng.int(1e9), k: SPOTK[level], lv: level };
      if (verifySpot(d).ok) return d;
    }
    return null;
  }
  function explainSpot(d, s) {
    s = s || buildSpot(d);
    return 'The ' + d.k + ' differences:\n' + s.diffs.map((df, i) => (i + 1) + '. ' + df.what).join('\n');
  }

  /* ---------- exports ---------- */

  Object.assign(V, {
    inDom, stepV, turnOf, rotSet, OPS, matrixPredict, matrixRuleHolds, seqPredict, seqRuleHolds, genMatrix, verifyMatrix, explainMatrix, matrixRows,
    genNext, verifyNext, explainNext, seqRows, seqCap, ruleHints, RCOL, MREC, NREC, cap1, andList,
    genOdd, verifyOdd, oddDraw, oddCaption, explainOdd, oddFeatures, mirrorAxis, OHINT, OTYPES, OKEY,
    genFold, verifyFold, unfoldHoles, paperStates, stateOutline, holesAtState, sheetSVG, stateSVG, creasesOf, explainFold, HOLEW, foldChoices,
    genMirror, verifyMirror, mirrorAnswer, cellsSVG, explainMirror, MT,
    genSpot, verifySpot, buildSpot, sceneSVG, explainSpot, SPOTK, THEMEW, SW, SH,
    RAD, INK, n1, range, popcount, uniq, LETTERS, pathOf, xf, regular, boxCentre, areaOf, centroidOf, inPoly, edgeDist, isConvex, cornerQuality,
    UNIT, ngon, hatch, fillShape, drawShape, svgWrap, figSVG, capOf, wordOf, FILLW, SIZEW, DIRW, ARROWS, PLURAL, SIDEW, NUMW
  });
})(typeof window !== 'undefined' ? window : globalThis);
